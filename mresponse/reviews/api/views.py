from rest_framework import generics, permissions

from mresponse.reviews import models as reviews_models
from mresponse.reviews.api import serializers as reviews_serializers


class Review(generics.RetrieveAPIView):
    queryset = reviews_models.Review.objects.select_related(
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
        review = generics.get_object_or_404(self.get_queryset())
        # TODO: Add locking mechanism to assign the review to a user.
        return review
