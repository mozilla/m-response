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
    skip_url = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        show_response_url = kwargs.pop('show_response_url', False)
        show_skip_url = kwargs.pop('show_skip_url', False)
        show_assignment_expires_at = kwargs.pop('show_assignment_expires_at', False)

        super().__init__(*args, **kwargs)

        if not show_response_url:
            del self.fields['response_url']

        if not show_skip_url:
            del self.fields['skip_url']

        if not show_assignment_expires_at:
            del self.fields['assignment_expires_at']

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
            'assignment_expires_at',
            'response_url',
            'skip_url',
        )
        read_only_fields = ('android_version',)

    def get_response_url(self, instance):
        return reverse.reverse(
            'create_response',
            kwargs={'review_pk': instance.pk},
            request=self.context.get('request'),
        )

    def get_skip_url(self, instance):
        return reverse.reverse(
            'skip_review',
            request=self.context.get('request'),
            kwargs={
                'review_pk': self.instance.pk
            }
        )
