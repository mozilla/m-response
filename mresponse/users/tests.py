from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import TestCase

User = get_user_model()


def get_can_skip_community_response_moderation_user():
    user = User.objects.create()
    permission = Permission.objects.get(codename='can_bypass_community_moderation')
    user.user_permissions.add(permission)
    return user


class TestUsers(TestCase):

    def test_can_skip_community_response_moderation(self):
        user = get_can_skip_community_response_moderation_user()
        self.assertTrue(user.profile.can_skip_community_response_moderation)

    def test_cannot_skip_community_response_moderation(self):
        user = User.objects.create()
        self.assertFalse(user.profile.can_skip_community_response_moderation)
