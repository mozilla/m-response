import random


def get_random_entry(queryset):
    count = queryset.count()
    if not count:
        return
    random_entry_index = random.randint(0, count - 1)
    return queryset[random_entry_index]


def get_review_entry(queryset):
    """Return the newest entry or a random one."""
    objs = queryset.filter(created_on__isnull=False)
    if objs.exists():
        return objs.latest("created_on")
    return get_random_entry(queryset)


class PlaystoreUploadException(Exception):
    pass
