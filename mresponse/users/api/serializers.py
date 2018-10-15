from django.contrib import auth

from rest_framework import serializers

from mresponse.users import models as users_models


class MyUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = users_models.UserProfile
        fields = ('karma_points', 'moderation_count', 'response_count',)


class MyUserSerializer(serializers.ModelSerializer):
    profile = MyUserProfileSerializer()

    class Meta:
        model = auth.get_user_model()
        fields = ('username', 'profile',)
