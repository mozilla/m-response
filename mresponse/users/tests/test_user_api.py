from django.test import TestCase
from django.urls import reverse

from mresponse.moderations.tests.factories import ModerationFactory
from mresponse.responses.tests.test_get_response_api import ResponseFactory
from mresponse.users.tests.factories import UserFactory


class TestUserApi(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.user.set_password('password')
        self.user.save()

        response = ResponseFactory(author=self.user)
        ModerationFactory.create_batch(response=response, positive_in_tone=True, size=11)

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
