from rest_framework import generics, permissions

from mresponse.users.api import serializers as users_serializers


class MyUser(generics.RetrieveAPIView):
    serializer_class = users_serializers.MyUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
