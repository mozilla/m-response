import factory

from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import TestCase

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = User
        django_get_or_create = ('username',)

    username = 'jane'


class BypassCommunityModerationUserFactory(UserFactory):

    @factory.post_generation
    def user_permissions(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of permissions were passed in, use them
            for permission in extracted:
                self.user_permissions.add(permission)

        self.user_permissions.add(
            Permission.objects.get(codename='can_bypass_community_moderation')
        )


class TestUsers(TestCase):

    def test_can_skip_community_response_moderation(self):
        user = BypassCommunityModerationUserFactory()
        self.assertTrue(user.profile.can_skip_community_response_moderation)

    def test_cannot_skip_community_response_moderation(self):
        user = UserFactory()
        self.assertFalse(user.profile.can_skip_community_response_moderation)
