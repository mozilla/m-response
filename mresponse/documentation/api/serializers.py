from rest_framework import serializers

from mresponse.documentation import models


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Page
        fields = ['id', 'title', "body"]
