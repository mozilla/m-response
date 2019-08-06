from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from mresponse.canned_response.tests.fixtures import (make_category,
                                                      make_response)


class TestCannedResponseApi(TestCase):
    def setUp(self):
        User = get_user_model()

        self.user = User(
            username='testuser',
        )
        self.user.set_password('password')
        self.user.save()

        self.category = make_category()

        # Login
        self.client.login(username=self.user.username, password='password')

    def test_get_empty_response_list(self):
        response = self.client.get(reverse('canned_response:responses', kwargs=dict(category_slug=self.category.slug)))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_get_response_list(self):
        make_response(self.category)
        make_response(self.category)
        make_response(self.category)
        response = self.client.get(reverse('canned_response:responses', kwargs=dict(category_slug=self.category.slug)))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
