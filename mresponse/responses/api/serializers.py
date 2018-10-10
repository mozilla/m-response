from rest_framework import serializers

from mresponse.responses import models as responses_models
from mresponse.reviews.api import serializers as reviews_serializers


class ResponseSerializer(serializers.ModelSerializer):
    review = reviews_serializers.ReviewSerializer(read_only=True)

    class Meta:
        model = responses_models.Response
        fields = (
            'id',
            'author',
            'text',
            'submitted_at',
            'review',
        )
        read_only_fields = ('author', 'submitted_at',)
