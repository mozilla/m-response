from django.test import TestCase
from unittest.mock import patch

from mresponse.responses.tests.factories import ResponseSerializerFactory
from mresponse.users.tests.factories import (
    BypassCommunityModerationUserFactory,
    BypassStaffModerationUserFactory,
)


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

    @patch(
        "mresponse.responses.api.serializers.user_can_bypass_staff_approval_for_review"
    )
    def test_cannot_bypass_staff_moderation_with_wrong_locale(
        self, mock_user_can_bypass_staff_approval_for_review
    ):
        mock_user_can_bypass_staff_approval_for_review.return_value = False
        user = BypassStaffModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.approved)
        self.assertFalse(serializer.instance.staff_approved)
