from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from mresponse.images.models import Image

from .utils import get_test_image_file


class TestImageUpload(TestCase):
    def setUp(self):
        User = get_user_model()

        self.user = User(username="testuser")
        self.user.set_password("password")
        self.user.save()

        # Login
        self.client.login(username=self.user.username, password="password")

    def test_upload(self):
        response = self.client.post(
            reverse("images:upload"),
            {
                "image": SimpleUploadedFile(
                    "test.png", get_test_image_file().file.getvalue()
                )
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        # Check response
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(response.json().keys(), {"id", "src"})

        # Check image
        image = Image.objects.get()
        self.assertEqual((image.width, image.height), (640, 480))
        self.assertEqual(image.uploaded_by, self.user)
        self.assertTrue(image.uploaded_at)
        self.assertEqual(response.json()["id"], image.id)
        self.assertEqual(response.json()["src"], image.file.url)

    def test_upload_without_image(self):
        response = self.client.post(
            reverse("images:upload"), HTTP_X_REQUESTED_WITH="XMLHttpRequest"
        )

        # Check response
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(response.json(), {"error": "No file uploaded"})

        # Check image wasn't created
        self.assertFalse(Image.objects.exists())

    def test_upload_with_unsupported_format(self):
        response = self.client.post(
            reverse("images:upload"),
            {"image": SimpleUploadedFile("test.txt", b"This is not an image!")},
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        # Check response
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(response.json(), {"error": "Not a supported image format."})

        # Check image wasn't created
        self.assertFalse(Image.objects.exists())

    def test_upload_with_bad_file(self):
        response = self.client.post(
            reverse("images:upload"),
            {"image": SimpleUploadedFile("test.png", b"This is not an image!")},
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        # Check response
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(response.json(), {"error": "Not a valid image."})

        # Check image wasn't created
        self.assertFalse(Image.objects.exists())

    def test_upload_with_wrong_extension(self):
        response = self.client.post(
            reverse("images:upload"),
            {
                "image": SimpleUploadedFile(
                    "test.jpg", get_test_image_file().file.getvalue()
                )
            },
            HTTP_X_REQUESTED_WITH="XMLHttpRequest",
        )

        # Check response
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(response.json(), {"error": "Not a valid JPEG image."})

        # Check image wasn't created
        self.assertFalse(Image.objects.exists())
