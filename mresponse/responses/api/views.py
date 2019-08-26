from django.db import models, transaction
from django.utils.translation import ugettext_lazy as _
from rest_framework import exceptions, generics, permissions, response, views
from rest_framework.pagination import PageNumberPagination

from mresponse.responses import models as responses_models
from mresponse.responses.api import serializers as responses_serializers
from mresponse.reviews import models as reviews_models
from mresponse.utils import queryset

RESPONSE_KARMA_POINTS_AMOUNT = 1


class CreateResponse(generics.CreateAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_review_for_user(self):
        """
        Get a review that matches the ID in the URL and has been
        assigned to the current user.
        """
        qs = reviews_models.Review.objects.unresponded()
        qs = qs.assigned_to_user(
            self.request.user
        )
        return generics.get_object_or_404(qs, pk=self.kwargs['review_pk'])

    @transaction.atomic
    def perform_create(self, serializer):
        review = self.get_review_for_user()
        author_user = self.request.user
        serializer.save(
            review=review,
            author=author_user,
        )
        review.assigned_to = None
        review.assigned_to_user_at = None

        # Give karma points to response author
        author_profile = author_user.profile
        author_profile.karma_points = (
                models.F('karma_points') + RESPONSE_KARMA_POINTS_AMOUNT
        )
        author_profile.save(update_fields=('karma_points',))

        review.save()


class ResponsePagination(PageNumberPagination):
    page_size = 4


class GetResponse(generics.ListAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = ResponsePagination
    queryset = responses_models.Response.objects.select_related(
        'review',
        'review__application',
        'review__application_version',
    ).moderator_queue()

    def get_serializer(self, *args, **kwargs):
        kwargs['show_moderation_url'] = True
        kwargs['show_skip_url'] = True
        return super().get_serializer(*args, **kwargs)

    def choose_response_for_user(self):
        try:
            # Get assignment assigned to user first if there's any.

            # Workaround: `not_expired` queryset cannot be chained with filters
            not_expired = responses_models.ResponseAssignedToUser.objects.not_expired()
            not_expired_pks = not_expired.values_list('pk', flat=True)
            not_expired_qs = responses_models.ResponseAssignedToUser.objects.filter(
                pk__in=not_expired_pks
            )
            users_response_assignment = not_expired_qs.distinct().get(user=self.request.user)

            # If user's assignment is not expired, update the assignment date.
            # Expired assignments are deleted in the assign_to_user.
            response = users_response_assignment.response
            response.assign_to_user(
                self.request.user
            )
            return response
        except responses_models.ResponseAssignedToUser.DoesNotExist:
            pass

        base_queryset = self.get_queryset().not_moderated_by(
            self.request.user
        ).not_authored_by(self.request.user)

        chosen_response = queryset.get_random_entry(base_queryset.two_or_less_moderations())

        if chosen_response is None:
            raise exceptions.NotFound(
                'No responses available in the moderator queue.'
            )

        chosen_response.assign_to_user(self.request.user)

        return chosen_response

    def get_object(self):
        return self.choose_response_for_user()


class SkipResponse(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, *args, format=None, **kwargs):
        try:
            response_assignment = (
                responses_models.ResponseAssignedToUser.objects.get(
                    user=self.request.user,
                    response_id=kwargs['response_pk'],
                )
            )
        except responses_models.ResponseAssignedToUser.DoesNotExist:
            raise exceptions.NotFound(
                detail=_('User has no assigned response of this ID.')
            )
        response_assignment.delete()
        return response.Response()
