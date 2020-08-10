from django.test import TestCase

from django.utils import timezone
from datetime import timedelta

from mresponse.responses.tests.factories import ResponseFactory, UserFactory
from mresponse.moderations.tests.factories import ModerationFactory, ApprovalFactory
from mresponse.leaderboard.models import Leaderboard


class TestLeaderboardManager(TestCase):

    week_ago = timezone.now() - timedelta(days=7)

    def test_response(self):
        ResponseFactory(submitted_at=self.week_ago)
        leaderboard = Leaderboard.objects.generate_weekly_leaderboard()
        scores = leaderboard.records.values_list("score", flat=True)
        self.assertSequenceEqual(scores, [1])

    def test_moderation(self):
        response = ResponseFactory(submitted_at=self.week_ago)
        ModerationFactory(
            submitted_at=self.week_ago,
            response=response,
            moderator=UserFactory(username="user1"),
        )
        leaderboard = Leaderboard.objects.generate_weekly_leaderboard()
        scores = leaderboard.records.values_list("score", flat=True)
        self.assertSequenceEqual(scores, [1, 1])

    def test_approval(self):
        response = ResponseFactory(submitted_at=self.week_ago)
        ApprovalFactory(
            approved_at=self.week_ago,
            response=response,
            approver=UserFactory(username="user1"),
        )
        leaderboard = Leaderboard.objects.generate_weekly_leaderboard()
        scores = leaderboard.records.values_list("score", flat=True)
        self.assertSequenceEqual(scores, [1, 1])

    def test_do_not_count_own_moderations(self):
        user = UserFactory()
        response = ResponseFactory(submitted_at=self.week_ago, author=user)
        ModerationFactory(submitted_at=self.week_ago, response=response, moderator=user)
        leaderboard = Leaderboard.objects.generate_weekly_leaderboard()
        scores = leaderboard.records.values_list("score", flat=True)
        self.assertSequenceEqual(scores, [1])

    def test_do_not_count_own_approvals(self):
        user = UserFactory()
        response = ResponseFactory(submitted_at=self.week_ago, author=user)
        ApprovalFactory(approved_at=self.week_ago, response=response, approver=user)
        leaderboard = Leaderboard.objects.generate_weekly_leaderboard()
        scores = leaderboard.records.values_list("score", flat=True)
        self.assertSequenceEqual(scores, [1])
