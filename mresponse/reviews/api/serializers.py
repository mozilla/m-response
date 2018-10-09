from rest_framework import serializers

from mresponse.reviews import models as reviews_models


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = reviews_models.Review
        fields = (
            'id',
            'android_sdk_version',
            'android_version',
            'author_name',
            'application',
            'application_version',
            'review_text',
            'review_rating',
            'last_modified',
        )
        read_only_fields = ('android_version',)
