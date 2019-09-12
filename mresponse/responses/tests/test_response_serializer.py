from django.test import TestCase

from mresponse.responses.tests.factories import ResponseSerializerFactory
from mresponse.users.tests.factories import BypassStaffModerationUserFactory, \
    BypassCommunityModerationUserFactory


class TestResponseSerializer(TestCase):
    def test_cannot_bypass_community_moderation(self):
        serializer = ResponseSerializerFactory()
        self.assertFalse(serializer.instance.approved)

    def test_can_bypass_community_moderation(self):
        user = BypassCommunityModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.approved)

    def test_cannot_bypass_staff_moderation(self):
        serializer = ResponseSerializerFactory()
        self.assertFalse(serializer.instance.staff_approved)

    def test_can_bypass_staff_moderation(self):
        user = BypassStaffModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.staff_approved)
