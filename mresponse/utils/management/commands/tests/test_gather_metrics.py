from datetime import timedelta
from django.utils import timezone

from django.test import TestCase

from mresponse.responses.tests.factories import (
    ReviewFactory,
    ResponseFactory,
    ArchivedReviewFactory,
)
from mresponse.users.tests.factories import UserFactory
from mresponse.moderations.tests.factories import ModerationFactory

from mresponse.utils.management.commands.gather_metrics import Command


class TestRespondedReviews(TestCase):
    def time_buffer(self, hours=2):
        return timezone.now() - timedelta(hours=hours)

    def review(self, **kwargs):
        return ReviewFactory(last_modified=self.time_buffer(), **kwargs)

    def response(self, **kwargs):
        if "review" not in kwargs:
            kwargs["review"] = ReviewFactory(last_modified=self.time_buffer())
        if (
            kwargs["submitted_to_play_store"]
            and "submitted_to_play_store_at" not in kwargs
        ):
            kwargs["submitted_to_play_store_at"] = self.time_buffer()
        return ResponseFactory(**kwargs)

    def test_simple(self):
        self.review()
        self.review()
        self.response(submitted_to_play_store=False)
        self.response(submitted_to_play_store=True)

        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 0.25)

    def test_no_reviews(self):
        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 0)

    def test_high_star_reviews(self):
        self.review(review_rating=3)
        self.response(submitted_to_play_store=True,)

        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 1)

    def test_reviews_outside_period(self):
        old_review = ReviewFactory(last_modified=self.time_buffer(4))
        self.response(review=old_review, submitted_to_play_store=True)
        self.response(submitted_to_play_store=True)

        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 0.5)

    def test_reviews_in_language(self):
        de_review = self.review(review_language="de")
        self.response(review=de_review, submitted_to_play_store=True)
        self.response(submitted_to_play_store=False)

        result = Command().responded_reviews(period=timedelta(hours=1), language="de")
        self.assertEqual(result, 1)

    def test_reviews_archived(self):
        ArchivedReviewFactory(last_modified=self.time_buffer())
        self.response(submitted_to_play_store=True)

        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 1)

    def test_reviews_since(self):
        ReviewFactory(last_modified=timezone.now() - timedelta(hours=100))
        self.response(submitted_to_play_store=True)

        result = Command().responded_reviews(
            period=timedelta(hours=1), since=timezone.now() - timedelta(hours=99)
        )
        self.assertEqual(result, 1)

    def test_ignores_reviews_within_period(self):
        self.response(submitted_to_play_store=True)
        ReviewFactory()
        ResponseFactory(
            review=ReviewFactory(),
            submitted_to_play_store=True,
            submitted_to_play_store_at=timezone.now(),
        )

        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 1)

    def test_handles_rejected_responses(self):
        review = self.review()
        self.response(review=review, submitted_to_play_store=False, rejected=True)
        self.response(review=review, submitted_to_play_store=True)

        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 1)

    def test_doesnt_fail_with_no_submitted_to_play_store_at(self):
        response = self.response(submitted_to_play_store=True)
        response.submitted_to_play_store_at = None
        response.save()

        result = Command().responded_reviews(period=timedelta(hours=1))
        self.assertEqual(result, 0)


class TestActiveContributors(TestCase):
    def test_required_responses(self):
        user1 = UserFactory(username="user1")
        user2 = UserFactory(username="user2")

        ResponseFactory(author=user1)
        ResponseFactory(author=user1)
        ResponseFactory(author=user2)

        result = Command().active_contributors(
            required_responses=2, required_moderations=0, period=timedelta(hours=1)
        )
        self.assertEqual(result, 1)

    def test_required_moderations(self):
        user1 = UserFactory(username="user1")
        user2 = UserFactory(username="user2")

        ModerationFactory(response=ResponseFactory(), moderator=user1)
        ModerationFactory(response=ResponseFactory(), moderator=user1)
        ModerationFactory(response=ResponseFactory(), moderator=user2)

        result = Command().active_contributors(
            required_responses=0, required_moderations=2, period=timedelta(hours=1)
        )
        self.assertEqual(result, 1)

    def test_responses_outside_period(self):
        ResponseFactory(submitted_at=timezone.now() - timedelta(hours=2))

        result = Command().active_contributors(
            required_responses=1, required_moderations=0, period=timedelta(hours=1)
        )
        self.assertEqual(result, 0)

    def test_moderations_outside_period(self):
        ModerationFactory(
            response=ResponseFactory(), submitted_at=timezone.now() - timedelta(hours=2)
        )

        result = Command().active_contributors(
            required_responses=0, required_moderations=1, period=timedelta(hours=1)
        )
        self.assertEqual(result, 0)
