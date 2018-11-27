import random


def get_random_entry(queryset):
    count = queryset.count()
    if not count:
        return
    random_entry_index = random.randint(0, count - 1)
    return queryset[random_entry_index]


class PlaystoreUploadException(Exception):
    pass
