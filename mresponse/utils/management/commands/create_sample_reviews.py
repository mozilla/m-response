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

REVIEWS_TO_CREATE = 100
USER_TO_CREATE = 10


class Command(BaseCommand):
    help = "Creates example reviews"

    def handle(self, *args, **kwargs):
        application, _ = Application.objects.get_or_create(name="FireFox", package="org.mozilla.firefox.test")
        application_version, _ = ApplicationVersion.objects.get_or_create(application=application, name='Final',
                                                                          code=1)

        users = []
        for _ in range(USER_TO_CREATE):
            email = faker.email()
            user = User.objects.create(first_name=faker.first_name(), last_name=faker.last_name(), email=email,
                                       username=email)
            users.append(
                user)
            self.stdout.write(self.style.WARNING('created %s' % user))

        for _ in range(REVIEWS_TO_CREATE):
            review = Review.objects.create(play_store_review_id=str(uuid.uuid4()), author_name=faker.name(),
                                           application=application, application_version=application_version,
                                           review_text=faker.text(), review_rating=random.randint(0, 5),
                                           last_modified=now())

            response = Response.objects.create(review=review, approved=False, author=random.choice(users),
                                               text=faker.text())
            self.stdout.write(self.style.WARNING('created %s' % response))

        self.stdout.write(self.style.SUCCESS('Successfully created %s users' % USER_TO_CREATE))
        self.stdout.write(self.style.SUCCESS('Successfully created %s reviews' % REVIEWS_TO_CREATE))
