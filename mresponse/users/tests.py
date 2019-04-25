from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase

from .constants import (FIRST_LEVEL_TRUSTED_CONTRIBUTOR,
                        SECOND_LEVEL_TRUSTED_CONTRIBUTOR)

User = get_user_model()


def get_first_level_trusted_user():
    user = User.objects.create()
    group = Group.objects.get(name=FIRST_LEVEL_TRUSTED_CONTRIBUTOR)
    user.groups.add(group)
    return user


def get_second_level_trusted_user():
    user = User.objects.create()
    group = Group.objects.get(name=SECOND_LEVEL_TRUSTED_CONTRIBUTOR)
    user.groups.add(group)
    return user


def get_untrusted_user():
    return User.objects.create()


class TestUsers(TestCase):

    def test_first_level_trusted_can_skip_community_response_moderation(self):
        user = get_first_level_trusted_user()
        self.assertTrue(user.profile.can_skip_community_response_moderation)

    def test_second_level_trusted_can_skip_community_response_moderation(self):
        user = get_second_level_trusted_user()
        self.assertTrue(user.profile.can_skip_community_response_moderation)

    def test_cannot_skip_communinty_response_moderation_no_user_groups(self):
        user = get_untrusted_user()
        self.assertFalse(user.profile.can_skip_community_response_moderation)

    def test_cannot_skip_community_response_moderation_non_trusted_group(self):
        user = get_untrusted_user()
        group = Group.objects.create(name='Untrusted')
        user.groups.add(group)
        self.assertFalse(user.profile.can_skip_community_response_moderation)

    def test_first_level_trusted_cannot_skip_staff_response_moderation(self):
        user = get_first_level_trusted_user()
        self.assertFalse(user.profile.can_skip_staff_response_moderation)

    def test_second_level_trusted_can_skip_staff_response_moderation(self):
        user = get_second_level_trusted_user()
        self.assertTrue(user.profile.can_skip_staff_response_moderation)

    def test_cannot_skip_staff_response_moderation_no_user_groups(self):
        user = get_untrusted_user()
        self.assertFalse(user.profile.can_skip_staff_response_moderation)

    def test_cannot_skip_staff_response_moderation_non_trusted_group(self):
        user = get_untrusted_user()
        group = Group.objects.create(name='Untrusted')
        user.groups.add(group)
        self.assertFalse(user.profile.can_skip_staff_response_moderation)
