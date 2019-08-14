from django.contrib import auth
from rest_framework import serializers

from mresponse.users import models as users_models


class MyUserStatSerializer(serializers.Serializer):
    """
    Stats are calculated based on a 7 day running window.
    """

    positive_in_tone_count = serializers.IntegerField(default=0)
    positive_in_tone_change = serializers.FloatField()
    addressing_the_issue_count = serializers.IntegerField(default=0)
    addressing_the_issue_change = serializers.FloatField()
    personal_count = serializers.IntegerField(default=0)
    personal_change = serializers.FloatField()

    current_count = serializers.IntegerField(default=0)
    previous_count = serializers.IntegerField(default=0)


class MyUserProfileSerializer(serializers.ModelSerializer):
    stats = MyUserStatSerializer(read_only=True, source='profile_stats')

    class Meta:
        model = users_models.UserProfile
        fields = ('karma_points', 'moderation_count', 'response_count',
                  'languages', 'name', 'avatar',
                  'can_skip_community_response_moderation', 'stats', 'is_moderator')


class MyUserMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = users_models.UserProfile
        fields = ('languages', 'name')


class MyUserSerializer(serializers.ModelSerializer):
    profile = MyUserProfileSerializer()

    class Meta:
        model = auth.get_user_model()
        fields = ('username', 'email', 'profile',)
