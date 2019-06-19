import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import TestCase

from mresponse.applications.models import Application
from mresponse.reviews.models import Review

from .api.serializers import ResponseSerializer

User = get_user_model()


def get_can_bypass_community_response_moderation_user():
    user = User.objects.create()
    permission = Permission.objects.get(codename='can_bypass_community_moderation')
    user.user_permissions.add(permission)
    return user


def get_can_bypass_staff_response_moderation_user():
    user = User.objects.create()
    permission = Permission.objects.get(codename='can_bypass_staff_moderation')
    user.user_permissions.add(permission)
    return user


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

    def test_cannot_bypass_community_moderation(self):
        serializer = get_serializer(User.objects.create())
        self.assertFalse(serializer.instance.approved)

    def test_can_bypass_community_moderation(self):
        user = get_can_bypass_community_response_moderation_user()
        serializer = get_serializer(user)
        self.assertTrue(serializer.instance.approved)

    def test_cannot_bypass_staff_moderation(self):
        serializer = get_serializer(User.objects.create())
        self.assertFalse(serializer.instance.staff_approved)

    def test_can_bypass_staff_moderation(self):
        user = get_can_bypass_staff_response_moderation_user()
        serializer = get_serializer(user)
        self.assertTrue(serializer.instance.staff_approved)
