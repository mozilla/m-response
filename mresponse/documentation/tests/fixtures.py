from faker import Faker
from mresponse.documentation import models

fake = Faker()


def make_page(**kwargs):
    title = " ".join(fake.words())
    defaults = {"title": title, "body": fake.text(max_nb_chars=1000)}

    defaults.update(kwargs)

    return models.Page.objects.create(**defaults)
