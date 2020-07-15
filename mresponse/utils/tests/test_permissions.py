from django.test import TestCase
from mresponse.users.tests.factories import (
    UserFactory,
    BypassStaffModerationUserFactory,
)
from mresponse.responses.tests.factories import ReviewFactory
import factory

from mresponse.utils.permissions import user_can_bypass_staff_approval_for_review


class TestModeratorInLanguage(TestCase):
    def test_user_with_no_moderator_languages(self):
        user = BypassStaffModerationUserFactory(
            profile=factory.RelatedFactory(
                "mresponse.users.tests.factories.UserProfileFactory",
                factory_related_name="user",
                permissions_in_locales=[],
            )
        )
        review = ReviewFactory(review_language="en")
        self.assertFalse(user_can_bypass_staff_approval_for_review(user, review))

    def test_user_with_matching_moderator_languages(self):
        user = BypassStaffModerationUserFactory(
            profile=factory.RelatedFactory(
                "mresponse.users.tests.factories.UserProfileFactory",
                factory_related_name="user",
                permissions_in_locales=["en", "es"],
            )
        )
        review = ReviewFactory(review_language="es")
        self.assertTrue(user_can_bypass_staff_approval_for_review(user, review))

    def test_user_with_non_matching_moderator_languages(self):
        user = BypassStaffModerationUserFactory(
            profile=factory.RelatedFactory(
                "mresponse.users.tests.factories.UserProfileFactory",
                factory_related_name="user",
                permissions_in_locales=["de", "fr"],
            )
        )
        review = ReviewFactory(review_language="es")
        self.assertFalse(user_can_bypass_staff_approval_for_review(user, review))

    def test_user_non_moderator(self):
        user = UserFactory(
            profile=factory.RelatedFactory(
                "mresponse.users.tests.factories.UserProfileFactory",
                factory_related_name="user",
                permissions_in_locales=["en"],
            )
        )
        review = ReviewFactory(review_language="en")
        self.assertFalse(user_can_bypass_staff_approval_for_review(user, review))
