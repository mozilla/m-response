from rest_framework import reverse, serializers

from mresponse.responses import models as responses_models
from mresponse.reviews.api import serializers as reviews_serializers


class ResponseSerializer(serializers.ModelSerializer):
    review = reviews_serializers.ReviewSerializer(read_only=True)
    moderation_url = serializers.SerializerMethodField()

    class Meta:
        model = responses_models.Response
        fields = (
            'id',
            'text',
            'submitted_at',
            'review',
            'moderation_url',
        )
        read_only_fields = ('submitted_at',)

    def __init__(self, *args, **kwargs):
        show_moderation_url = kwargs.pop('show_moderation_url', False)

        super().__init__(*args, **kwargs)

        if not show_moderation_url:
            del self.fields['moderation_url']

    def get_moderation_url(self, instance):
        return reverse.reverse(
            'create_moderation',
            kwargs={'response_pk': instance.pk},
            request=self.context.get('request'),
        )
