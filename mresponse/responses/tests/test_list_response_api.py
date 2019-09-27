from rest_framework.test import APITestCase

from mresponse.responses.tests.factories import ResponseFactory
from mresponse.users.tests.factories import UserFactory


class TestListResponseApi(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_login(self.user)

    def test_get_responses(self):
        ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.get('/api/response/')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()['results']), 1)

    def test_cant_see_my_own_responses(self):
        ResponseFactory(approved=False, author=self.user)
        result = self.client.get('/api/response/')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()['results']), 0)
