from rest_framework import serializers

from mresponse.applications.api import serializers as applications_serializers
from mresponse.responses.api import serializers as responses_serializers
from mresponse.reviews import models as reviews_models


class ReviewSerializer(serializers.ModelSerializer):
    application = applications_serializers.ApplicationSerializer()
    application_version = (
        applications_serializers.ApplicationVersionSerializer(
            hide_application=True,
        )
    )
    response = responses_serializers.ResponseSerializer()

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
            'response',
        )
        read_only_fields = ('android_version',)
