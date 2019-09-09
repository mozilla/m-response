from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from mresponse.moderations.mommy_recipes import ModerationRecipe
from mresponse.responses.mommy_recipes import ResponseRecipe


class TestUserApi(TestCase):
    def setUp(self):
        User = get_user_model()

        self.user = User(
            username='testuser',
        )
        self.user.set_password('password')
        self.user.save()

        response = ResponseRecipe.make(author=self.user)
        ModerationRecipe.make(response=response, positive_in_tone=True, _quantity=11)

        # Login
        self.client.login(username=self.user.username, password='password')

    def test_user_profile_api(self):
        response = self.client.get(reverse('my_user'))
        self.assertCountEqual(response.data['profile'].keys(), [
            'karma_points',
            'moderation_count',
            'response_count',
            'languages',
            'name',
            'avatar',
            'can_skip_community_response_moderation',
            'stats',
            'is_super_moderator'
        ])

    def test_user_api(self):
        response = self.client.get(reverse('my_user'))
        self.assertCountEqual(response.data.keys(), ['username', 'email', 'profile'])

    def test_user_profile_stats_api(self):
        response = self.client.get(reverse('my_user'))
        self.assertCountEqual(response.data['profile']['stats'].keys(), [
            'positive_in_tone_count',
            'positive_in_tone_change',
            'addressing_the_issue_count',
            'addressing_the_issue_change',
            'personal_count',
            'personal_change',
            'previous_count',
            'current_count',
        ])
