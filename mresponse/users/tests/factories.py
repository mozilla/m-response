from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.db.models import signals
from mresponse.users.models import UserProfile

import factory

User = get_user_model()


@factory.django.mute_signals(signals.post_save)
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("username",)

    username = "jane"
    profile = factory.RelatedFactory(
        "mresponse.users.tests.factories.UserProfileFactory",
        factory_related_name="user",
    )


class BypassCommunityModerationUserFactory(UserFactory):
    username = "andrea"

    @factory.post_generation
    def user_permissions(self, create, extracted, **kwargs):
        self.user_permissions.add(
            Permission.objects.get(codename="can_bypass_community_moderation")
        )


class BypassStaffModerationUserFactory(UserFactory):
    username = "sarah"
    profile = factory.RelatedFactory(
        "mresponse.users.tests.factories.UserProfileFactory",
        factory_related_name="user",
        permissions_in_locales=["en"],
    )

    @factory.post_generation
    def user_permissions(self, create, extracted, **kwargs):
        self.user_permissions.add(
            Permission.objects.get(codename="can_bypass_staff_moderation")
        )


class UserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserProfile
        django_get_or_create = ("user",)

    user = factory.SubFactory("mresponse.users.tests.factories.UserFactory")
