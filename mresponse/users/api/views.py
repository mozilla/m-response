from django.contrib.auth import logout as user_logout
from django.core.cache import cache
from django.shortcuts import redirect

from rest_framework import generics, permissions, response, status, views

from mresponse.reviews.models import Review
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
            request.user.profile, data=request.data
        )

        if serializer.is_valid():
            # Invalidate review cache and assigned reviews on language edit
            if "languages" in serializer.validated_data.keys():
                if (
                    serializer.validated_data["languages"]
                    != request.user.profile.languages
                ):
                    assigned_reviews = Review.objects.filter(assigned_to=request.user)
                    assigned_reviews.update(assigned_to=None)
                    user_key = "next_review_user_{}".format(request.user.pk)
                    cache.delete(user_key)

            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def logout(request):
    user_logout(request)
    return redirect("/")
