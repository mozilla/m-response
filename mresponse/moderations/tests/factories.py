import factory

from mresponse.moderations.models import Moderation
from mresponse.users.tests.factories import UserFactory


class ModerationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Moderation

    moderator = factory.SubFactory(UserFactory)
    addressing_the_issue = True
    personal = True
    positive_in_tone = True
