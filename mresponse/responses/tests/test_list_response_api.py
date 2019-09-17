from rest_framework.test import APITestCase

from mresponse.responses.tests.factories import ResponseFactory
from mresponse.users.tests.factories import UserFactory


class TestListResponseApi(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_login(self.user)

    def test_get_response(self):
        response = ResponseFactory(approved=False)
        result = self.client.get('/api/response/{}/'.format(response.pk))
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()['id'], response.pk)
