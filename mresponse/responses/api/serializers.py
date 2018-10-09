from rest_framework import serializers

from mresponse.responses import models as responses_models


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = responses_models.Response
        fields = (
            'author',
            'text',
            'submitted_at',
        )
        read_only_fields = ('author', 'submitted_at')
