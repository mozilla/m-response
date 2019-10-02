from django.urls import reverse

from rest_framework.test import APITestCase

from mresponse.moderations.tests.factories import ModerationFactory
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

    def test_create_moderation_if_user_is_author(self):
        response = ResponseFactory(approved=False, author=self.user)
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))
        self.assertEqual(result.status_code, 400)

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


class TestModerationkarmaPointsApi(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_login(self.user)

    def test_first_moderation(self):
        self.assertEqual(self.user.profile.karma_points, 0)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        self.assertEqual(response.moderation_count(), 0)
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))
        self.assertEqual(result.status_code, 201)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.karma_points, 1)

    def test_second_moderation(self):
        self.assertEqual(self.user.profile.karma_points, 0)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ModerationFactory(response=response)
        self.assertEqual(response.moderation_count(), 1)
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))
        self.assertEqual(result.status_code, 201)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.karma_points, 2)

    def test_third_moderation(self):
        self.assertEqual(self.user.profile.karma_points, 0)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ModerationFactory(response=response)
        ModerationFactory(response=response)
        self.assertEqual(response.moderation_count(), 2)
        result = self.client.post(reverse('create_moderation', kwargs={"response_pk": response.pk}), data=dict(
            positive_in_tone=True,
            addressing_the_issue=True,
            personal=True
        ))
        self.assertEqual(result.status_code, 201)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.karma_points, 3)
