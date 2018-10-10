from rest_framework import serializers

from mresponse.applications import models as applications_models


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = applications_models.Application
        fields = ('name', 'package',)


class ApplicationVersionSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer()

    def __init__(self, *args, **kwargs):
        if kwargs.pop('hide_application', False):
            del self.fields['application']
        super().__init__(*args, **kwargs)

    class Meta:
        model = applications_models.ApplicationVersion
        fields = ('name', 'code', 'application',)
