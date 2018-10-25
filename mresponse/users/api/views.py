from rest_framework import generics, permissions, status, views, response

from mresponse.users.api import serializers as users_serializers


class MyUser(generics.RetrieveAPIView):
    serializer_class = users_serializers.MyUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class MyUserMeta(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = users_serializers.MyUserMetaSerializer(
            request.user.profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
