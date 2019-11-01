from rest_framework import reverse, serializers

from mresponse.moderations import models as moderations_models
from mresponse.responses import models as responses_models
from mresponse.reviews.api import serializers as reviews_serializers


class ResponseSerializer(serializers.ModelSerializer):
    review = reviews_serializers.ReviewSerializer(read_only=True)
    moderation_url = serializers.SerializerMethodField()
    approve_url = serializers.SerializerMethodField()
    skip_url = serializers.SerializerMethodField()
    moderation_count = serializers.IntegerField(default=0, read_only=True)

    class Meta:
        model = responses_models.Response
        fields = (
            "id",
            "text",
            "submitted_at",
            "review",
            "approve_url",
            "moderation_url",
            "skip_url",
            "moderation_count",
        )
        read_only_fields = ("submitted_at",)

    def __init__(self, *args, **kwargs):
        show_moderation_url = kwargs.pop("show_moderation_url", False)
        show_skip_url = kwargs.pop("show_skip_url", False)

        super().__init__(*args, **kwargs)

        if not show_moderation_url:
            del self.fields["moderation_url"]

        if not show_skip_url:
            del self.fields["skip_url"]

    def save(self, **kwargs):
        author = kwargs.get("author", None)
        add_missing_moderations = False

        if author:
            if author.has_perm("responses.can_bypass_community_moderation"):
                kwargs["approved"] = True
                add_missing_moderations = True
            if author.has_perm("responses.can_bypass_staff_moderation"):
                kwargs["approved"] = True
                kwargs["staff_approved"] = True
                add_missing_moderations = True

        response = super().save(**kwargs)

        # If response is automatically approved
        # create missing moderations
        if add_missing_moderations:
            if response.approved and not response.moderations.all().exists():
                for i in range(3):
                    moderations_models.Moderation.objects.create(
                        response=response,
                        moderator=author,
                        positive_in_tone=True,
                        addressing_the_issue=True,
                        personal=True,
                    )

    def get_moderation_url(self, instance):
        return reverse.reverse(
            "create_moderation",
            kwargs={"response_pk": instance.pk},
            request=self.context.get("request"),
        )

    def get_approve_url(self, instance):
        return reverse.reverse(
            "approve",
            kwargs={"response_pk": instance.pk},
            request=self.context.get("request"),
        )

    def get_skip_url(self, instance):
        return reverse.reverse(
            "skip_response",
            kwargs={"response_pk": instance.pk},
            request=self.context.get("request"),
        )
