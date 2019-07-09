from django.utils.translation import ugettext_lazy as _

from rest_framework import exceptions, generics, permissions, response, views

from mresponse.reviews import models as reviews_models
from mresponse.reviews.api import serializers as reviews_serializers
from mresponse.utils import queryset as queryset_utils

MAX_REVIEW_RATING = 2


class Review(generics.RetrieveAPIView):
    """
    Get a review and assign it to user.
    """
    queryset = reviews_models.Review.objects.responder_queue().select_related(
        'application',
        'application_version',
        'response',
    ).filter(review_rating__lte=MAX_REVIEW_RATING)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['show_assignment_expires_at'] = True
        kwargs['show_response_url'] = True
        kwargs['show_skip_url'] = True
        return super().get_serializer(*args, **kwargs)

    def get_languages_list(self):
        try:
            lang_list = self.request.GET['lang'].split(',')
        except KeyError:
            return []
        return [l.strip() for l in lang_list if l.strip()]

    def choose_review_for_user(self):
        """
        Assign or get assigned review for a user to respond on.
        """
        # Get a review that is already assigned for the current user.
        try:
            review = self.get_queryset().assigned_to_user(
                self.request.user
            ).get()
            # Renew assignment
            review.assign_to_user(self.request.user)
            return review
        except reviews_models.Review.DoesNotExist:
            pass

        # Otherwise try to elect  a review that is avaialble in the
        # queue and assign it to user.
        base_queryset = self.get_queryset()

        # Prioritise English
        querysets = [
            base_queryset.languages(['en']),
        ]

        # Then prioritise users' languages
        languages_list = self.get_languages_list()
        if languages_list:
            querysets.append(base_queryset.languages(languages_list))

        for queryset in querysets:
            review = queryset_utils.get_random_entry(
                queryset
            )
            if review is not None:
                break

        if review is None:
            raise exceptions.NotFound(
                detail=_('No reviews available in the queue.')
            )
        review.assign_to_user(self.request.user)
        return review

    def get_object(self):
        return self.choose_review_for_user()


class NextReview(generics.RetrieveAPIView):
    """
    Gets the next review in the queue that isn't assigned to a user.
    """
    queryset = reviews_models.Review.objects.unresponded().select_related(
        'application',
        'application_version',
        'response',
    ).filter(review_rating__lte=MAX_REVIEW_RATING)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

    def get_object(self):
        review = self.get_queryset().responder_queue().first()
        if review is None:
            raise exceptions.NotFound(
                detail=_('No reviews available in the queue.')
            )
        return review


class SkipReview(views.APIView):
    def post(self, *args, format=None, **kwargs):
        try:
            review = reviews_models.Review.objects.assigned_to_user(
                self.request.user
            ).get(pk=kwargs['review_pk'])
        except reviews_models.Review.DoesNotExist:
            raise exceptions.NotFound(
                detail=_('User has no assigned review of this ID.')
            )
        review.return_to_the_queue()
        return response.Response()
