from django.utils.translation import ugettext_lazy as _

from rest_framework import exceptions, generics, permissions, views

from mresponse.responses import models as responses_models
from mresponse.responses.api import serializers as responses_serializers
from mresponse.reviews import models as reviews_models
from mresponse.utils import queryset


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

    def perform_create(self, serializer):
        review = self.get_review_for_user()
        serializer.save(
            review=review,
            author=self.request.user,
        )


class GetResponse(generics.RetrieveAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)
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
            users_response_assignment = (
                responses_models.ResponseAssignedToUser.objects.not_expired().get(
                    user=self.request.user
                )
            )

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

        querysets = (
            base_queryset.two_or_more_moderations(),
            base_queryset.one_moderation(),
            base_queryset.no_moderations(),
        )
        for qs in querysets:
            chosen_response = queryset.get_random_entry(qs)
            if chosen_response is not None:
                break
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
                responses_models.ResponseAssignedToUser.objects.not_expired().get(
                    user=self.request.user
                )
            )
        except responses_models.ResponseAssignedToUser.DoesNotExist:
            raise exceptions.NotFound(
                detail=_('User has no assigned response of this ID.')
            )
        response_assignment.delete()
