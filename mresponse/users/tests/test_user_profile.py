from datetime import timedelta
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils.timezone import now

from mresponse.moderations.mommy_recipes import ModerationRecipe
from mresponse.responses.mommy_recipes import ResponseRecipe

User = get_user_model()


class TestProfileUsers(TestCase):

    def setUp(self) -> None:
        self.user = User.objects.create(username='test_user', )

    def test_profile_returns_default_stats(self):
        self.assertEquals(self.user.profile.profile_stats,
                          dict(positive_in_tone_count=0, positive_in_tone_change=None, addressing_the_issue_count=0,
                               addressing_the_issue_change=None, personal_count=0, personal_change=None,
                               current_count=0, previous_count=0))

    def test_current_count(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, positive_in_tone=True, _quantity=11)
        ModerationRecipe.make(response=response, positive_in_tone=False, _quantity=5)
        self.assertEquals(self.user.profile.profile_stats['current_count'], 16)

    def test_previous_count(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, positive_in_tone=True, _quantity=11,
                              submitted_at=now() - timedelta(days=10))
        ModerationRecipe.make(response=response, positive_in_tone=False, _quantity=5,
                              submitted_at=now() - timedelta(days=11))
        self.assertEquals(self.user.profile.profile_stats['previous_count'], 16)

    def test_positive_in_tone_count(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, positive_in_tone=True)
        self.assertEquals(self.user.profile.profile_stats['positive_in_tone_count'], 1)

    def test_positive_in_tone_change(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, positive_in_tone=True, _quantity=11)
        ModerationRecipe.make(response=response, positive_in_tone=False, _quantity=5)

        ModerationRecipe.make(response=response, positive_in_tone=True, _quantity=10,
                              submitted_at=now() - timedelta(days=10))
        self.assertEquals(self.user.profile.profile_stats['positive_in_tone_change'], .1)

    def test_addressing_the_issue_count(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, addressing_the_issue=True)
        self.assertEquals(self.user.profile.profile_stats['addressing_the_issue_count'], 1)

    def test_addressing_the_issue_change(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, addressing_the_issue=True, _quantity=11)
        ModerationRecipe.make(response=response, addressing_the_issue=False, _quantity=5)

        ModerationRecipe.make(response=response, addressing_the_issue=True, _quantity=10,
                              submitted_at=now() - timedelta(days=10))
        self.assertEquals(self.user.profile.profile_stats['addressing_the_issue_change'], .1)

    def test_personal_count(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, personal=True)
        self.assertEquals(self.user.profile.profile_stats['personal_count'], 1)

    def test_personal_change(self):
        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, personal=True, _quantity=10,
                              submitted_at=now() - timedelta(days=10))
        ModerationRecipe.make(response=response, personal=True, _quantity=5)
        ModerationRecipe.make(response=response, personal=False, _quantity=5)
        self.assertEquals(self.user.profile.profile_stats['personal_change'], -0.5)
