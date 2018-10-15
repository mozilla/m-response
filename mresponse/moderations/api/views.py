from rest_framework import generics, permissions

from mresponse.moderations.api import serializers as moderations_serializers
from mresponse.responses import models as responses_models


class CreateModeration(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = moderations_serializers.ModerationSerializer

    def get_response_for_user(self):
        """
        Get a response that matches the ID in the URL and has been
        assigned to the current user.
        """
        qs = responses_models.Response.objects.moderator_queue()
        # TODO: Restrict by user
        return generics.get_object_or_404(qs, pk=self.kwargs['response_pk'])

    def perform_create(self, serializer):
        serializer.save(
            response=self.get_response_for_user(),
            moderator=self.request.user,
        )
