from rest_framework import generics

from mresponse.users.api import serializers as users_serializers


class MyUser(generics.RetrieveAPIView):
    serializer_class = users_serializers.MyUserSerializer

    def get_object(self):
        return self.request.user
