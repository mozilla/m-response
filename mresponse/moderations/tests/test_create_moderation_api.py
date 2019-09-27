from django.urls import reverse

from rest_framework.test import APITestCase

from mresponse.responses.tests.factories import ResponseFactory
from mresponse.users.tests.factories import UserFactory


class TestCreateModerationApi(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_login(self.user)

    def test_create_moderation(self):
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))
        self.assertEqual(result.status_code, 201)
        response.refresh_from_db()
        self.assertFalse(response.approved)

    def test_is_approved_after_moderations(self):
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))
        self.assertEqual(result.status_code, 201)

        user = UserFactory()
        self.client.force_login(user)
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))
        self.assertEqual(result.status_code, 201)

        user = UserFactory()
        self.client.force_login(user)
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))

        self.assertEqual(result.status_code, 201)

        response.refresh_from_db()
        self.assertTrue(response.approved)
