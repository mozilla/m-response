from rest_framework import serializers

from mresponse.moderations import models as moderations_models


class ModerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = moderations_models.Moderation
        fields = (
            'positive_in_tone',
            'addressing_the_issue',
            'personal',
            'submitted_at',
            'feedback_message',
        )

    def validate_feedback_message(self, value):
        # If value is absent, just return it.
        if not value:
            return value

        # Do not allow leaving feedback message by non-trusted users.
        user = self.context['request'].user

        if not (
            user.has_perm('responses.can_bypass_staff_moderation')
            or user.has_perm('responses.can_bypass_community_moderation')
        ):
            raise serializers.ValidationError(
                'Feedback message can be only added by trusted users.'
            )

        return value
