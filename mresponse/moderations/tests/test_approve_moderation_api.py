from django.urls import reverse

from rest_framework.test import APITestCase

from mresponse.moderations.tests.factories import ModerationFactory
from mresponse.responses.tests.factories import ResponseFactory
from mresponse.users.tests.factories import (
    BypassCommunityModerationUserFactory, BypassStaffModerationUserFactory,
    UserFactory)


class TestApprovalApi(APITestCase):
    def test_approve_base_user(self):
        user = UserFactory()
        self.client.force_login(user)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(reverse('approve', kwargs={"response_pk": response.pk}))
        self.assertEqual(result.status_code, 403)

    def test_approval_as_mod_one(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(reverse('approve', kwargs={"response_pk": response.pk}))
        self.assertEqual(result.status_code, 200)

        response.refresh_from_db()
        self.assertTrue(response.approved)
        self.assertFalse(response.staff_approved)

    def test_approval_as_mod_two(self):
        user = BypassStaffModerationUserFactory()
        self.client.force_login(user)
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.post(reverse('approve', kwargs={"response_pk": response.pk}))
        self.assertEqual(result.status_code, 200)

        response.refresh_from_db()
        self.assertTrue(response.approved)
        self.assertTrue(response.staff_approved)


class TestApproveKarmaPointsApi(APITestCase):

    def test_first_approval(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)

        result = self.client.post(reverse('approve', kwargs={"response_pk": response.pk}))
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 1)
        self.assertEqual(author.profile.karma_points, 1)

    def test_second_approval(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)
        self.assertEqual(user.profile.karma_points, 0)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)
        ModerationFactory(response=response)

        result = self.client.post(reverse('approve', kwargs={"response_pk": response.pk}))
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 2)
        self.assertEqual(author.profile.karma_points, 1)

    def test_third_approval(self):
        user = BypassCommunityModerationUserFactory()
        self.client.force_login(user)
        self.assertEqual(user.profile.karma_points, 0)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)
        ModerationFactory(response=response)
        ModerationFactory(response=response)

        result = self.client.post(reverse('approve', kwargs={"response_pk": response.pk}))
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 3)
        self.assertEqual(author.profile.karma_points, 1)

    def test_approval_by_staff(self):
        user = BypassStaffModerationUserFactory()
        self.client.force_login(user)
        self.assertEqual(user.profile.karma_points, 0)

        author = UserFactory(username="smith")
        response = ResponseFactory(approved=False, author=author)
        ModerationFactory(response=response)
        ModerationFactory(response=response)
        ModerationFactory(response=response)

        result = self.client.post(reverse('approve', kwargs={"response_pk": response.pk}))
        self.assertEqual(result.status_code, 200)

        user.profile.refresh_from_db()
        author.profile.refresh_from_db()

        self.assertEqual(user.profile.karma_points, 3)
        self.assertEqual(author.profile.karma_points, 1)
