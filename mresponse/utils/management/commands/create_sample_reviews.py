import random
import uuid

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils.timezone import now
from faker import Faker

from mresponse.applications.models import Application, ApplicationVersion
from mresponse.responses.models import Response
from mresponse.reviews.models import Review

User = get_user_model()

faker = Faker()


class Command(BaseCommand):
    help = "Creates example reviews"

    def handle(self, *args, **kwargs):
        application, _ = Application.objects.get_or_create(name="FireFox", package="org.mozilla.firefox.test")
        application_version, _ = ApplicationVersion.objects.get_or_create(application=application, name='Final',
                                                                          code=1)

        users = []
        for _ in range(10):
            email = faker.email()
            users.append(
                User.objects.create(first_name=faker.first_name(), last_name=faker.last_name(), email=email,
                                    username=email))
        for _ in range(100):
            review = Review.objects.create(play_store_review_id=str(uuid.uuid4()), author_name=faker.name(),
                                           application=application, application_version=application_version,
                                           review_text=faker.text(), review_rating=random.randint(0, 5),
                                           last_modified=now())

            Response.objects.create(review=review, approved=False, author=random.choice(users),
                                    text=faker.text())
