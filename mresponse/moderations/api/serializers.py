from rest_framework import serializers

from mresponse.moderations import models as moderations_models


class ModerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = moderations_models.Moderation
        fields = (
            'positive_in_tone',
            'addressing_the_issue',
            'personal',
            'karma_points',
            'submitted_at',
        )
