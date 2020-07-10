from rest_framework.test import APITestCase

from mresponse.responses.tests.factories import (
    ReviewFactory,
    ArchivedReviewFactory,
    ResponseFactory,
    ArchivedResponseFactory,
)
from mresponse.users.tests.factories import UserFactory


class TestHomepage(APITestCase):
    def setUp(self):
        self.user = UserFactory(username="smith")
        self.client.force_login(self.user)

    def test_respond_queue(self):
        ReviewFactory()
        result = self.client.get("/api/homepage/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()["respond_queue"], 1)

    def test_respond_queue_archived(self):
        ArchivedReviewFactory()
        result = self.client.get("/api/homepage/")
        self.assertEqual(result.json()["respond_queue"], 0)

    def test_moderate_queue(self):
        ResponseFactory(approved=False)
        result = self.client.get("/api/homepage/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()["moderate_queue"], 1)

    def test_moderate_queue_archived(self):
        ArchivedResponseFactory(approved=False)
        result = self.client.get("/api/homepage/")
        self.assertEqual(result.json()["moderate_queue"], 0)
