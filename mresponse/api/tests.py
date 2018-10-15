import django.test

import rest_framework.test
from rest_framework import status


class TestRootAPI(django.test.TestCase):
    def setUp(self):
        self.client = rest_framework.test.APIClient()

    def test_returns_ok(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_dict(self):
        response = self.client.get('/api/')
        content = response.json()
        self.assertEqual(content.keys(), {'config',})


class TestConfigurationAPI(django.test.TestCase):
    def setUp(self):
        self.client = rest_framework.test.APIClient()

    def test_returns_200_okay(self):
        response = self.client.get('/api/config/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_returns_dictionary(self):
        response = self.client.get('/api/config/')
        content = response.json()
        self.assertEqual(content.keys(), {'languages', 'response_guide_book_url'})

    def test_languages_are_list(self):
        response = self.client.get('/api/config/')
        content = response.json()
        self.assertIsInstance(content['languages'], list)

    def test_language_items(self):
        response = self.client.get('/api/config/')
        content = response.json()
        for lang_dict in content['languages']:
            self.assertEqual(lang_dict.keys(), {'id', 'display_name'})
