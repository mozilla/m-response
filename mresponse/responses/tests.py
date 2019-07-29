import datetime
import json

from django.contrib.auth import get_user_model
from django.test import TestCase

import rest_framework.test
from rest_framework import status

import factory
from mresponse.applications.models import Application
from mresponse.reviews.models import Review
from mresponse.users.tests import (BypassCommunityModerationUserFactory,
                                   BypassStaffModerationUserFactory,
                                   UserFactory)

from .api.serializers import ResponseSerializer
from .models import Response

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


class TestResponseQuery(TestCase):
    def test_moderator_queue_with_no_approved_responses(self):
        ResponseSerializerFactory()
        self.assertEqual(1, Response.objects.moderator_queue().count())

    def test_moderator_queue_with_one_approved_response(self):
        ResponseSerializerFactory()
        ResponseSerializerFactory.create(author=BypassCommunityModerationUserFactory())
        self.assertEqual(1, Response.objects.moderator_queue().count())

    def test_moderator_queue_with_two_approved_responses(self):
        ResponseSerializerFactory.create(author=BypassCommunityModerationUserFactory())
        ResponseSerializerFactory.create(author=BypassCommunityModerationUserFactory())
        self.assertEqual(0, Response.objects.moderator_queue().count())


class TestGetResponseView(TestCase):
    def setUp(self):
        self.client = rest_framework.test.APIClient()

    def test_returning_no_responses_to_moderate_with_no_responses(self):
        self.client.force_authenticate(user=UserFactory())
        response = self.client.get('/api/response/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            json.loads(response.content.decode())['detail'],
            'No responses available in the moderator queue.'
        )

    def test_returning_a_response_to_moderate(self):
        self.client.force_authenticate(user=UserFactory())
        ResponseSerializerFactory()
        response = self.client.get('/api/response/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content.decode())['text'], 'test')

    def test_returning_no_responses_to_moderate_for_approved_response(self):
        self.client.force_authenticate(user=BypassCommunityModerationUserFactory())
        ResponseSerializerFactory.create(author=BypassCommunityModerationUserFactory())
        response = self.client.get('/api/response/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            json.loads(response.content.decode())['detail'],
            'No responses available in the moderator queue.'
        )
