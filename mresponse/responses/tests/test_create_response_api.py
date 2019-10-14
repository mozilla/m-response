from rest_framework.test import APITestCase

from mresponse.responses.tests.factories import ReviewFactory
from mresponse.users.tests.factories import UserFactory


class TestCreateResponseApi(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.author_user = UserFactory(username="smith")
        self.client.force_login(self.user)

    def test_create_response(self):
        review = ReviewFactory()
        review.assign_to_user(self.user)
        result = self.client.post('/api/response/create/{}/'.format(review.pk), dict(
            text="Hello World"
        ))
        self.assertEqual(result.status_code, 201)

    def test_karma_points_on_creation_of_response(self):
        self.assertEqual(self.user.profile.karma_points, 0)
        review = ReviewFactory()
        review.assign_to_user(self.user)
        result = self.client.post('/api/response/create/{}/'.format(review.pk), dict(
            text="Hello World"
        ))
        self.assertEqual(result.status_code, 201)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.karma_points, 0)
