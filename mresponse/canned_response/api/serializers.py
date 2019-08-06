from rest_framework import serializers

from mresponse.canned_response import models


class CategorySerializer(serializers.ModelSerializer):
    response_count = serializers.IntegerField(source='response_set.count',
                                              read_only=True)

    responses = serializers.HyperlinkedIdentityField(view_name='canned_response:responses', lookup_field='slug',
                                                     lookup_url_kwarg='category_slug')

    class Meta:
        model = models.Category
        fields = ['responses', 'response_count', "name", "slug"]


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Response
        fields = ['id', "text"]
