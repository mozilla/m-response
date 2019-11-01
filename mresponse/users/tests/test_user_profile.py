from datetime import timedelta

from django.test import TestCase
from django.utils.timezone import now

from mresponse.moderations.tests.factories import ModerationFactory
from mresponse.responses.tests.test_get_response_api import ResponseFactory
from mresponse.users.tests.factories import UserFactory


class TestProfileUsers(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory()

    def test_profile_returns_default_stats(self):
        self.assertEquals(
            self.user.profile.profile_stats,
            dict(
                positive_in_tone_count=0,
                positive_in_tone_change=None,
                addressing_the_issue_count=0,
                addressing_the_issue_change=None,
                personal_count=0,
                personal_change=None,
                current_count=0,
                previous_count=0,
            ),
        )

    def test_current_count(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory.create_batch(
            response=response, positive_in_tone=True, size=11
        )
        ModerationFactory.create_batch(
            response=response, positive_in_tone=False, size=5
        )
        self.assertEquals(self.user.profile.profile_stats["current_count"], 16)

    def test_previous_count(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory.create_batch(
            response=response,
            positive_in_tone=True,
            size=11,
            submitted_at=now() - timedelta(days=10),
        )
        ModerationFactory.create_batch(
            response=response,
            positive_in_tone=False,
            size=5,
            submitted_at=now() - timedelta(days=11),
        )
        self.assertEquals(self.user.profile.profile_stats["previous_count"], 16)

    def test_positive_in_tone_count(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory(response=response, positive_in_tone=True)
        self.assertEquals(self.user.profile.profile_stats["positive_in_tone_count"], 1)

    def test_positive_in_tone_change(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory.create_batch(
            response=response, positive_in_tone=True, size=11
        )
        ModerationFactory.create_batch(
            response=response, positive_in_tone=False, size=5
        )

        ModerationFactory.create_batch(
            response=response,
            positive_in_tone=True,
            size=10,
            submitted_at=now() - timedelta(days=10),
        )
        self.assertEquals(
            self.user.profile.profile_stats["positive_in_tone_change"], 0.1
        )

    def test_addressing_the_issue_count(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory(response=response, addressing_the_issue=True)
        self.assertEquals(
            self.user.profile.profile_stats["addressing_the_issue_count"], 1
        )

    def test_addressing_the_issue_change(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory.create_batch(
            response=response, addressing_the_issue=True, size=11
        )
        ModerationFactory.create_batch(
            response=response, addressing_the_issue=False, size=5
        )

        ModerationFactory.create_batch(
            response=response,
            addressing_the_issue=True,
            size=10,
            submitted_at=now() - timedelta(days=10),
        )
        self.assertEquals(
            self.user.profile.profile_stats["addressing_the_issue_change"], 0.1
        )

    def test_personal_count(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory(response=response, personal=True)
        self.assertEquals(self.user.profile.profile_stats["personal_count"], 1)

    def test_personal_change(self):
        response = ResponseFactory(author=self.user)
        ModerationFactory.create_batch(
            response=response,
            personal=True,
            size=10,
            submitted_at=now() - timedelta(days=10),
        )
        ModerationFactory.create_batch(response=response, personal=True, size=5)
        ModerationFactory.create_batch(response=response, personal=False, size=5)
        self.assertEquals(self.user.profile.profile_stats["personal_change"], -0.5)
