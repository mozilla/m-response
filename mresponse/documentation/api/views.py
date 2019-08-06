from rest_framework import generics, permissions

from mresponse.documentation import models
from mresponse.documentation.api import serializers


class PageList(generics.ListAPIView):
    serializer_class = serializers.PageSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = models.Page.objects.all()
