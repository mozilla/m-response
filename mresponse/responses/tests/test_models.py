from django.test import TestCase
from django.test.utils import override_settings
from unittest.mock import patch

from django.utils import timezone

from mresponse.responses.tests.factories import ResponseFactory


class TestResponse(TestCase):
    @override_settings(PLAY_STORE_SUBMIT_REPLY_ENABLED=True)
    @patch("mresponse.responses.models.reply_to_review")
    def test_submit_to_play_store(self, mock_reply_to_review):
        response = ResponseFactory(approved=True, staff_approved=True)

        self.assertFalse(response.submitted_to_play_store)
        self.assertIsNone(response.submitted_to_play_store_at)

        response.submit_to_play_store()

        self.assertTrue(response.submitted_to_play_store)
        self.assertTrue(
            timezone.now() - response.submitted_to_play_store_at
            < timezone.timedelta(minutes=1)
        )
