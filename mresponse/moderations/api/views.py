from django.db import models, transaction

from rest_framework import generics, permissions

from mresponse.moderations.api import serializers as moderations_serializers
from mresponse.responses import models as responses_models

MODERATION_KARMA_POINTS_AMOUNT = 1


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

        # Update user's karma points
        user_profile = response.author.profile
        user_profile.karma_points = (
            models.F('karma_points') + MODERATION_KARMA_POINTS_AMOUNT
        )
        user_profile.save(update_fields=('karma_points',))
