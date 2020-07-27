from django.urls import reverse
from django.test.utils import override_settings
from unittest.mock import patch

from rest_framework.test import APITestCase

from mresponse.moderations.tests.factories import ModerationFactory
from mresponse.responses.tests.factories import ResponseFactory
from mresponse.users.tests.factories import (
    BypassCommunityModerationUserFactory,
    BypassStaffModerationUserFactory,
    UserFactory,
)


@override_settings(PLAY_STORE_SUBMIT_REPLY_ENABLED=True)
@patch("mresponse.responses.models.reply_to_review")
class TestApprovalApi(APITestCase):
    def test_approve_base_user(self, mock_reply_to_review):
        user = UserFactory()
        self.client.force_login(user)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 403)
        mock_reply_to_review.assert_not_called()

    def test_approval_as_mod_one(self, mock_reply_to_review):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)
        mock_reply_to_review.assert_not_called()

        response.refresh_from_db()
        self.assertTrue(response.approved)
        self.assertFalse(response.staff_approved)
        self.assertFalse(response.submitted_to_play_store)

    def test_approval_as_mod_two(self, mock_reply_to_review):
        user = BypassStaffModerationUserFactory()
        self.client.force_login(user)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)
        mock_reply_to_review.assert_called()

        response.refresh_from_db()
        self.assertTrue(response.approved)
        self.assertTrue(response.staff_approved)
        self.assertTrue(response.submitted_to_play_store)

    @patch("mresponse.moderations.api.views.user_can_bypass_staff_approval_for_review")
    def test_approval_as_mod_two_without_locale(
        self, mock_user_can_bypass_staff_approval_for_review, mock_reply_to_review
    ):
        mock_user_can_bypass_staff_approval_for_review.return_value = False
        user = BypassStaffModerationUserFactory()
        self.client.force_login(user)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)
        mock_reply_to_review.assert_not_called()

        response.refresh_from_db()
        self.assertTrue(response.approved)
        self.assertFalse(response.staff_approved)
        self.assertFalse(response.submitted_to_play_store)


class TestApproveKarmaPointsApi(APITestCase):
    def test_first_approval(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)

        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 1)
        self.assertEqual(author.profile.karma_points, 1)

    def test_second_approval(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)
        self.assertEqual(user.profile.karma_points, 0)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)
        ModerationFactory(response=response)

        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 2)
        self.assertEqual(author.profile.karma_points, 1)

    def test_third_approval(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)
        self.assertEqual(user.profile.karma_points, 0)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)
        ModerationFactory(response=response)
        ModerationFactory(response=response)

        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 3)
        self.assertEqual(author.profile.karma_points, 1)

    def test_approval_after_moderation_by_staff(self):
        user = BypassStaffModerationUserFactory()
        self.client.force_login(user)
        self.assertEqual(user.profile.karma_points, 0)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)
        ModerationFactory(response=response)
        ModerationFactory(response=response)
        ModerationFactory(response=response)

        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 3)
        self.assertEqual(author.profile.karma_points, 1)

    def test_approval_by_staff(self):
        user = BypassStaffModerationUserFactory()
        self.client.force_login(user)
        self.assertEqual(user.profile.karma_points, 0)

        author = UserFactory(username="smith")
        self.assertEqual(author.profile.karma_points, 0)

        response = ResponseFactory(approved=False, staff_approved=True, author=author)

        result = self.client.post(
            reverse("approve", kwargs={"response_pk": response.pk})
        )
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 1)
        self.assertEqual(author.profile.karma_points, 1)
