from rest_framework.test import APITestCase

from mresponse.moderations.tests.factories import ModerationFactory
from mresponse.responses.tests.factories import ResponseFactory
from mresponse.users.tests.factories import (
    BypassCommunityModerationUserFactory,
    BypassStaffModerationUserFactory,
    UserFactory,
)


class TestListResponseApi(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_login(self.user)

    def test_get_responses(self):
        ResponseFactory(approved=False, author=UserFactory(username="smith"))
        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 1)

    def test_cant_see_my_own_responses(self):
        ResponseFactory(approved=False, author=self.user)
        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 0)

    def test_cant_see_reject_responses(self):
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe1"),
        )
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe2"),
        )
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe3"),
        )

        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 0)

    def test_mod_one_cant_see_reject_responses(self):
        self.client.force_login(BypassCommunityModerationUserFactory())
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe1"),
        )
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe2"),
        )
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe3"),
        )

        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 0)

    def test_mod_two_cant_see_rejected_responses(self):
        self.client.force_login(BypassStaffModerationUserFactory())
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe1"),
        )
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe2"),
        )
        ModerationFactory(
            response=response,
            addressing_the_issue=False,
            personal=False,
            positive_in_tone=False,
            moderator=UserFactory(username="joe3"),
        )

        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 0)

    def test_mod_one_cant_see_approved_responses(self):
        self.client.force_login(BypassCommunityModerationUserFactory())
        ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ResponseFactory(approved=True, author=UserFactory(username="joe"))
        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 1)

    def test_mod_two_cant_see_staff_approved_responses(self):
        self.client.force_login(BypassStaffModerationUserFactory())
        ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ResponseFactory(approved=True, author=UserFactory(username="joe"))
        ResponseFactory(
            approved=True, staff_approved=True, author=UserFactory(username="doe")
        )
        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 2)

    def test_mod_two_can_see_approved_responses(self):
        self.client.force_login(BypassStaffModerationUserFactory())
        response = ResponseFactory(approved=False, author=UserFactory(username="smith"))
        ModerationFactory(response=response, moderator=UserFactory(username="smith1"))
        ModerationFactory(response=response, moderator=UserFactory(username="smith2"))
        ModerationFactory(response=response, moderator=UserFactory(username="smith3"))
        response.refresh_from_db()
        self.assertTrue(response.is_community_approved())

        ResponseFactory(approved=True, author=UserFactory(username="joe"))
        ResponseFactory(
            approved=True, staff_approved=True, author=UserFactory(username="doe")
        )
        result = self.client.get("/api/response/")
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()["results"]), 2)
