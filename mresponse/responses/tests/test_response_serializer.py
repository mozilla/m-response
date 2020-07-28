from django.test import TestCase
from django.test.utils import override_settings
from unittest.mock import patch

from mresponse.responses.tests.factories import ResponseSerializerFactory
from mresponse.users.tests.factories import (
    BypassCommunityModerationUserFactory,
    BypassStaffModerationUserFactory,
)


@override_settings(PLAY_STORE_SUBMIT_REPLY_ENABLED=True)
@patch("mresponse.responses.models.reply_to_review")
class TestResponseSerializer(TestCase):
    def test_cannot_bypass_community_moderation(self, mock_reply_to_review):
        serializer = ResponseSerializerFactory()
        self.assertFalse(serializer.instance.approved)
        self.assertFalse(serializer.instance.staff_approved)
        self.assertFalse(serializer.instance.submitted_to_play_store)
        mock_reply_to_review.assert_not_called()

    def test_can_bypass_community_moderation(self, mock_reply_to_review):
        user = BypassCommunityModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.approved)
        self.assertFalse(serializer.instance.staff_approved)
        self.assertFalse(serializer.instance.submitted_to_play_store)
        mock_reply_to_review.assert_not_called()

    def test_cannot_bypass_staff_moderation(self, mock_reply_to_review):
        serializer = ResponseSerializerFactory()
        self.assertFalse(serializer.instance.staff_approved)
        self.assertFalse(serializer.instance.staff_approved)
        self.assertFalse(serializer.instance.submitted_to_play_store)
        mock_reply_to_review.assert_not_called()

    def test_can_bypass_staff_moderation(self, mock_reply_to_review):
        user = BypassStaffModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.approved)
        self.assertTrue(serializer.instance.staff_approved)
        self.assertTrue(serializer.instance.submitted_to_play_store)
        mock_reply_to_review.assert_called()

    @patch(
        "mresponse.responses.api.serializers.user_can_bypass_staff_approval_for_review"
    )
    def test_cannot_bypass_staff_moderation_with_wrong_locale(
        self, mock_user_can_bypass_staff_approval_for_review, mock_reply_to_review
    ):
        mock_user_can_bypass_staff_approval_for_review.return_value = False
        user = BypassStaffModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.approved)
        self.assertFalse(serializer.instance.staff_approved)
        self.assertFalse(serializer.instance.submitted_to_play_store)
        mock_reply_to_review.assert_not_called()
