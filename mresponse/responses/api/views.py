from django.contrib.admin.models import CHANGE, LogEntry
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from django.utils.translation import ugettext_lazy as _

from rest_framework import exceptions, generics, permissions, response, views
from rest_framework.pagination import PageNumberPagination

from mresponse.responses import models as responses_models
from mresponse.responses.api import serializers as responses_serializers
from mresponse.responses.api.permissions import (
    BypassStaffOrCommunityModerationPermissionOnUpdate,
)
from mresponse.reviews import models as reviews_models


class CreateResponse(generics.CreateAPIView):
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_review_for_user(self):
        """
        Get a review that matches the ID in the URL and has been
        assigned to the current user.
        """
        qs = reviews_models.Review.objects.unresponded()
        qs = qs.assigned_to_user(self.request.user)
        return generics.get_object_or_404(qs, pk=self.kwargs["review_pk"])

    @transaction.atomic
    def perform_create(self, serializer):
        review = self.get_review_for_user()
        author_user = self.request.user
        serializer.save(review=review, author=author_user)
        review.assigned_to = None
        review.assigned_to_user_at = None

        review.save()


class ResponsePagination(PageNumberPagination):
    page_size = 4


class ResponseMixin:
    serializer_class = responses_serializers.ResponseSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = ResponsePagination

    def get_languages_list(self):
        try:
            lang_list = self.request.GET["lang"].split(",")
        except KeyError:
            return []
        return [lang.strip() for lang in lang_list if lang.strip()]

    def get_queryset(self):
        qs = (
            responses_models.Response.objects.select_related(
                "review", "review__application", "review__application_version"
            )
            .not_moderated_by(self.request.user)
            .not_authored_by(self.request.user)
        )

        if self.request.user.profile.is_super_moderator:
            qs = qs.not_staff_approved().not_approved().skip_rejected()
        else:
            qs = qs.moderator_queue().two_or_less_moderations()

        languages = self.get_languages_list()
        if languages:
            qs = qs.languages(languages)

        return qs

    def get_serializer(self, *args, **kwargs):
        kwargs["show_moderation_url"] = True
        kwargs["show_skip_url"] = True
        return super().get_serializer(*args, **kwargs)


class RetrieveUpdateResponse(ResponseMixin, generics.RetrieveUpdateAPIView):
    lookup_url_kwarg = "review_pk"
    permission_classes = [BypassStaffOrCommunityModerationPermissionOnUpdate]

    def perform_update(self, serializer):
        obj = self.get_object()
        old_response = obj.text
        serializer.save()
        obj.refresh_from_db()
        LogEntry.objects.log_action(
            self.request.user.pk,
            ContentType.objects.get_for_model(obj).pk,
            obj.pk,
            f"Response {obj.pk} updated.",
            CHANGE,
            change_message=f"{old_response} -> {obj.text}",
        )


class ListResponse(ResponseMixin, generics.ListAPIView):
    pass


class SkipResponse(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, *args, format=None, **kwargs):
        try:
            response_assignment = responses_models.ResponseAssignedToUser.objects.get(
                user=self.request.user, response_id=kwargs["response_pk"]
            )
        except responses_models.ResponseAssignedToUser.DoesNotExist:
            raise exceptions.NotFound(
                detail=_("User has no assigned response of this ID.")
            )
        response_assignment.delete()
        return response.Response()
