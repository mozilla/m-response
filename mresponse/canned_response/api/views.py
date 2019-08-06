from rest_framework import generics, permissions

from mresponse.canned_response import models
from mresponse.canned_response.api import serializers


class CategoryList(generics.ListAPIView):
    serializer_class = serializers.CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = models.Category.objects.all()
