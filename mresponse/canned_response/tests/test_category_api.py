from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from mresponse.canned_response.tests.fixtures import (make_category,
                                                      make_response)


class TestCannedCategoryApi(TestCase):
    def setUp(self):
        User = get_user_model()

        self.user = User(
            username='testuser',
        )
        self.user.set_password('password')
        self.user.save()

        # Login
        self.client.login(username=self.user.username, password='password')

    def test_get_empty_category_list(self):
        response = self.client.get(reverse('canned_response:categories'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_get_category_list(self):
        make_category(name='category_1')
        make_category(name='category_2')
        make_category(name='category_3')
        response = self.client.get(reverse('canned_response:categories'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_response_count(self):
        cat = make_category(name='category_1')
        make_response(cat)
        make_response(cat)
        make_response(cat)
        make_response(cat)
        response = self.client.get(reverse('canned_response:categories'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['response_count'], 4)
