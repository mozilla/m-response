from rest_framework.test import APITestCase

from mresponse.responses.tests.factories import ResponseFactory
from mresponse.users.tests.factories import (
    BypassCommunityModerationUserFactory, BypassStaffModerationUserFactory,
    UserFactory)


class TestRetrieveUpdateResponseApi(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.author_user = UserFactory(username="smith")
        self.client.force_login(self.user)

    def test_get_response(self):
        response = ResponseFactory(approved=False, author=self.author_user)
        result = self.client.get('/api/response/{}/'.format(response.pk))
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()['id'], response.pk)

    def test_put_changes_to_response_as_moderator(self):
        user = UserFactory()
        self.client.force_login(user)

        response = ResponseFactory(approved=False, text="Bad response", author=self.author_user)
        good_text = "GooD Response."
        result = self.client.put('/api/response/{}/'.format(response.pk), dict(
            text=good_text
        ))
        self.assertEqual(result.status_code, 403)

    def test_put_changes_to_response_as_moderator_one(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)

        response = ResponseFactory(approved=False, text="Bad response", author=self.author_user)
        good_text = "GooD Response."
        result = self.client.put('/api/response/{}/'.format(response.pk), dict(
            text=good_text
        ))
        self.assertEqual(result.status_code, 200)
        response.refresh_from_db()
        self.assertEqual(response.text, good_text)

    def test_put_changes_to_response_as_moderator_two(self):
        user = BypassStaffModerationUserFactory()
        self.client.force_login(user)

        response = ResponseFactory(approved=False, text="Bad response", author=self.author_user)
        good_text = "GooD Response."
        result = self.client.put('/api/response/{}/'.format(response.pk), dict(
            text=good_text
        ))
        self.assertEqual(result.status_code, 200)
        response.refresh_from_db()
        self.assertEqual(response.text, good_text)
