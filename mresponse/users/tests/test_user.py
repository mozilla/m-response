from django.test import TestCase

from mresponse.users.tests.factories import UserFactory, BypassCommunityModerationUserFactory


class TestUsers(TestCase):
    def test_can_skip_community_response_moderation(self):
        user = BypassCommunityModerationUserFactory()
        self.assertTrue(user.profile.can_skip_community_response_moderation)

    def test_cannot_skip_community_response_moderation(self):
        user = UserFactory()
        self.assertFalse(user.profile.can_skip_community_response_moderation)
