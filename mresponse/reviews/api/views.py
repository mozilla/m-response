from django.utils.translation import ugettext_lazy as _

from rest_framework import exceptions, generics, permissions

from mresponse.reviews import models as reviews_models
from mresponse.reviews.api import serializers as reviews_serializers


class Review(generics.RetrieveAPIView):
    queryset = reviews_models.Review.objects.unresponded().select_related(
        'application',
        'application_version',
        'response',
    )
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

    def get_object(self):
        """
        Get review from the queue.
        """
        # TODO: Add priority of getting results
        review = self.get_queryset().first()

        if review is None:
            raise exceptions.NotFound(
                detail=_('No reviews available in the queue.')
            )

        # TODO: Add locking mechanism to assign the review to a user.
        return review
