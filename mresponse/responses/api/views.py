from rest_framework import generics, permissions

from mresponse.responses import models as responses_models
from mresponse.responses.api import serializers as responses_serializers
from mresponse.reviews import models as reviews_models
from mresponse.utils import queryset


class CreateResponse(generics.CreateAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_review_for_user(self):
        """
        Get a review that matches the ID in the URL and has been
        assigned to the current user.
        """
        qs = reviews_models.Review.objects.unresponded()
        qs = qs.assigned_to_user(
            self.request.user
        )
        return generics.get_object_or_404(qs, pk=self.kwargs['review_pk'])

    def perform_create(self, serializer):
        review = self.get_review_for_user()
        serializer.save(
            review=review,
            author=self.request.user,
        )


class GetResponse(generics.RetrieveAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = responses_models.Response.objects.select_related(
        'review',
        'review__application',
        'review__application_version',
    ).moderator_queue()

    def get_serializer(self, *args, **kwargs):
        kwargs['show_moderation_url'] = True
        return super().get_serializer(*args, **kwargs)

    def choose_response_for_user(self):
        # TODO: Get one assigned to user first.
        querysets = (
            self.get_queryset().two_or_more_moderations(),
            self.get_queryset().one_moderation(),
            self.get_queryset().no_moderations(),
        )
        for qs in querysets:
            chosen_response = queryset.get_random_entry(qs)

        # chosen_response.assign_to_user(self.request.user)

        return chosen_response

    def get_object(self):
        return self.choose_response_for_user()
