import factory
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("username",)

    username = "jane"


class BypassCommunityModerationUserFactory(UserFactory):
    username = "andrea"

    @factory.post_generation
    def user_permissions(self, create, extracted, **kwargs):
        self.user_permissions.add(
            Permission.objects.get(codename="can_bypass_community_moderation")
        )


class BypassStaffModerationUserFactory(UserFactory):
    username = "sarah"

    @factory.post_generation
    def user_permissions(self, create, extracted, **kwargs):
        self.user_permissions.add(
            Permission.objects.get(codename="can_bypass_staff_moderation")
        )