from rest_framework import generics, permissions

from mresponse.responses.api import serializers as responses_serializers
from mresponse.reviews import models as reviews_models


class CreateResponse(generics.CreateAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_review_for_user(self):
        """
        Get a review that matches the ID in the URL and has been
        assigned to the current user.
        """
        qs = reviews_models.Review.objects.unresponded()
        # TODO: Enable replying to assigned reviews only.
        # qs = qs.assigned_to_user(
            # self.request.user
        # )
        return generics.get_object_or_404(qs, pk=self.kwargs['review_pk'])

    def perform_create(self, serializer):
        review = self.get_review_for_user()
        serializer.save(
            review=review,
            author=self.request.user,
        )
