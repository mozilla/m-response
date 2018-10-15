from django.utils.translation import ugettext_lazy as _

from rest_framework import exceptions, generics, permissions, response, views

from mresponse.reviews import models as reviews_models
from mresponse.reviews.api import serializers as reviews_serializers


class Review(generics.RetrieveAPIView):
    """
    Get a review and assign it to user.
    """
    queryset = reviews_models.Review.objects.unresponded().select_related(
        'application',
        'application_version',
        'response',
    )
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

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
        review = self.get_queryset().responder_queue().first()
        if review is None:
            raise exceptions.NotFound(
                detail=_('No reviews available in the queue.')
            )
        review.assign_to_user(self.request.user)
        return review

    def get_object(self):
        return self.choose_review_for_user()


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
