from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions

from mresponse.canned_response import models
from mresponse.canned_response.api import serializers


class CategoryList(generics.ListAPIView):
    serializer_class = serializers.CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = models.Category.objects.all()


class MessageList(generics.ListAPIView):
    serializer_class = serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'category_slug'

    def get_queryset(self):
        category = get_object_or_404(models.Category, slug=self.kwargs[self.lookup_field])
        return models.Response.objects.filter(category=category)
