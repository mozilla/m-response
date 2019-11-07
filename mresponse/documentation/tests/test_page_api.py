from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from mresponse.documentation.tests.fixtures import make_page


class TestDocumentationApi(TestCase):
    def setUp(self):
        User = get_user_model()

        self.user = User(username="testuser")
        self.user.set_password("password")
        self.user.save()

        # Login
        self.client.login(username=self.user.username, password="password")

    def test_get_page_list_empty(self):
        response = self.client.get(reverse("documentation:pages"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_list_pages(self):
        make_page()
        make_page()
        make_page()
        response = self.client.get(reverse("documentation:pages"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_page_fields(self):
        make_page()
        response = self.client.get(reverse("documentation:pages"))
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(response.data[0].keys(), ("id", "title", "body"))
