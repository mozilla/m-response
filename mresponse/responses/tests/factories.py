import datetime

import factory
from mresponse.applications.models import Application
from mresponse.responses.api.serializers import ResponseSerializer
from mresponse.responses.models import Response
from mresponse.reviews.models import Review
from mresponse.users.tests.factories import UserFactory


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
