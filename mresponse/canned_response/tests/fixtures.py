from django.utils.text import slugify

from faker import Faker

from mresponse.canned_response import models

fake = Faker()


def make_category(**kwargs):
    name = " ".join(fake.words())
    defaults = {
        "name": name,
        "slug": slugify(name)
    }

    defaults.update(kwargs)

    return models.Category.objects.create(**defaults)


def make_response(category, **kwargs):
    defaults = {
        "text": fake.text(max_nb_chars=1000)
    }

    defaults.update(kwargs)

    return models.Response.objects.create(category=category, **defaults)
