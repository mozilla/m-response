from django.utils.translation import ugettext_lazy as _

from rest_framework import exceptions, generics, permissions

from mresponse.responses.api import serializers as responses_serializers
from mresponse.reviews import models as reviews_models


class CreateResponse(generics.CreateAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_review_for_user(self):
        # TODO: Override with getting the locked review.
        return reviews_models.Review.objects.unresponded().first()

    def perform_create(self, serializer):
        review = self.get_review_for_user()
        if review is None:
            raise exceptions.NotFound(
                detail=_('Your account has no assigned reviews.')
            )

        serializer.save(
            review=review,
            author=self.request.user,
        )
