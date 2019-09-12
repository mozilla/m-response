import datetime
import factory
from django.contrib.auth import get_user_model
from django.test import TestCase

from mresponse.applications.models import Application
from mresponse.responses.models import Response
from mresponse.reviews.models import Review
from mresponse.users.tests.factories import UserFactory

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


class ResponseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Response

    author = factory.SubFactory(UserFactory)
    review = factory.SubFactory(ReviewFactory)


class TestGetResponseApi(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.user.set_password('password')
        self.user.save()

        # Login
        self.client.login(username=self.user.username, password='password')

    def test_get_response(self):
        response = ResponseFactory()

        self
