from django.db import transaction

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
        assignment = generics.get_object_or_404(
            responses_models.ResponseAssignedToUser.objects.not_expired(),
            user=self.request.user,
            response_id=self.kwargs['response_pk']
        )
        return assignment.response

    @transaction.atomic
    def perform_create(self, serializer):
        response = self.get_response_for_user()
        serializer.save(
            response=response,
            moderator=self.request.user,
        )

        # Clear the assignment to the user.
        self.request.user.response_assignment.delete()

        # TODO: Check if response can be approved to send over to the Play
        # Store in here.
        # response.approved = True
        # response.save(update_fields=('approved',))
