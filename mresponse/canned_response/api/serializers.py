from rest_framework import serializers

from mresponse.canned_response import models


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Response
        fields = ['id', "text"]


class CategorySerializer(serializers.ModelSerializer):
    response_count = serializers.IntegerField(source='response_set.count',
                                              read_only=True)
    responses = ResponseSerializer(many=True, source="response_set")

    class Meta:
        model = models.Category
        fields = ['responses', 'response_count', "name", "slug"]
