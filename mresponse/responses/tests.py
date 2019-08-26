import datetime

from django.contrib.auth import get_user_model
from django.test import TestCase

import factory
from mresponse.applications.models import Application
from mresponse.reviews.models import Review
from mresponse.users.tests import (BypassCommunityModerationUserFactory,
                                   BypassStaffModerationUserFactory,
                                   UserFactory)

from .api.serializers import ResponseSerializer

User = get_user_model()


class ApplicationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Application
        django_get_or_create = ("package",)

    name = "Firefox"
    package = "org.test.firefox"


class ReviewFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Review

    application = factory.SubFactory(ApplicationFactory)
    last_modified = factory.LazyFunction(datetime.datetime.now)
    play_store_review_id = factory.Sequence(lambda n: n)
    review_rating = 1


class ResponseSerializerFactory(factory.Factory):
    class Meta:
        model = ResponseSerializer
        exclude = ("author",)

    data = {"text": "test"}
    author = UserFactory

    @classmethod
    def create(cls, **kwargs):
        obj = super().create(**kwargs)
        obj.is_valid()
        obj.save(review=ReviewFactory(), author=kwargs.get("author", UserFactory()))
        return obj


class TestResponseSerializer(TestCase):
    def test_cannot_bypass_community_moderation(self):
        serializer = ResponseSerializerFactory()
        self.assertFalse(serializer.instance.approved)

    def test_can_bypass_community_moderation(self):
        user = BypassCommunityModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.approved)

    def test_cannot_bypass_staff_moderation(self):
        serializer = ResponseSerializerFactory()
        self.assertFalse(serializer.instance.staff_approved)

    def test_can_bypass_staff_moderation(self):
        user = BypassStaffModerationUserFactory()
        serializer = ResponseSerializerFactory(author=user)
        self.assertTrue(serializer.instance.staff_approved)
