from rest_framework.test import APITestCase

from mresponse.responses.tests.factories import (
    ReviewFactory,
    ArchivedReviewFactory,
    ResponseFactory,
)
from mresponse.users.tests.factories import UserFactory


class TestReview(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_login(self.user)

    def test_get_single_review(self):
        review = ReviewFactory()
        result = self.client.get("/api/review/?lang=en")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()["id"], review.id)

    def test_dont_get_archived_review(self):
        ArchivedReviewFactory()
        result = self.client.get("/api/review/?lang=en")
        self.assertEqual(result.status_code, 404)

    def test_dont_get_responded_review(self):
        review = ReviewFactory()
        ResponseFactory(approved=False, review=review)

        result = self.client.get("/api/review/?lang=en")
        self.assertEqual(result.status_code, 404)

    def test_review_with_rejected_response_appears_again(self):
        review = ReviewFactory()
        ResponseFactory(approved=False, rejected=True, review=review)

        result = self.client.get("/api/review/?lang=en")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()["id"], review.id)

    def test_review_with_rejected_response_and_unrejected_response_doesnt_appear(self):
        review = ReviewFactory()
        ResponseFactory(approved=False, rejected=True, review=review)
        ResponseFactory(approved=False, rejected=False, review=review)

        result = self.client.get("/api/review/?lang=en")
        self.assertEqual(result.status_code, 404)
