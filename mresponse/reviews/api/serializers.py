from rest_framework import reverse, serializers

from mresponse.applications.api import serializers as applications_serializers
from mresponse.reviews import models as reviews_models


class ReviewSerializer(serializers.ModelSerializer):
    application = applications_serializers.ApplicationSerializer()
    application_version = (
        applications_serializers.ApplicationVersionSerializer(
            hide_application=True,
        )
    )
    response_url = serializers.SerializerMethodField()

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
            'is_unresponded',
            'response_url',
        )
        read_only_fields = ('android_version', 'is_unresponded', 'response',)

    def get_response_url(self, instance):
        return reverse.reverse(
            'create_response',
            kwargs={'review_pk': instance.pk},
            request=self.context.get('request'),
        )
