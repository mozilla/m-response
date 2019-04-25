import datetime

from django.contrib.auth import get_user_model
from django.test import TestCase

from mresponse.applications.models import Application
from mresponse.reviews.models import Review
from mresponse.users.tests import (get_first_level_trusted_user,
                                   get_second_level_trusted_user,
                                   get_untrusted_user)

from .api.serializers import ResponseSerializer

User = get_user_model()


def get_review():
    application = Application.objects.create()
    return Review.objects.create(
        review_rating=1,
        last_modified=datetime.datetime.now(),
        application=application
    )


def get_serializer(author):
    data = {'text': 'test'}
    serializer = ResponseSerializer(data=data)
    serializer.is_valid()
    serializer.save(
        review=get_review(),
        author=author
    )
    return serializer


class TestResponseSerializer(TestCase):

    def test_cannot_skip_community_moderation_if_not_trusted(self):
        serializer = get_serializer(get_untrusted_user())
        self.assertFalse(serializer.instance.approved)

    def test_can_skip_community_moderation_with_first_level_user(self):
        serializer = get_serializer(get_first_level_trusted_user())
        self.assertTrue(serializer.instance.approved)

    def test_can_skip_community_moderation_with_second_level_user(self):
        serializer = get_serializer(get_second_level_trusted_user())
        self.assertTrue(serializer.instance.approved)

    def test_cannot_skip_staff_moderation_if_not_trusted(self):
        serializer = get_serializer(get_untrusted_user())
        self.assertFalse(serializer.instance.staff_approved)

    def test_cannot_skip_staff_moderation_with_first_level_user(self):
        serializer = get_serializer(get_first_level_trusted_user())
        self.assertFalse(serializer.instance.staff_approved)

    def test_can_skip_staff_moderation_with_second_level_user(self):
        serializer = get_serializer(get_second_level_trusted_user())
        self.assertTrue(serializer.instance.staff_approved)
