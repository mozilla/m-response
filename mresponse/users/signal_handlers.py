from django.contrib import auth
from django.db.models import signals

from mresponse.users import models as users_models


def create_user_profile(instance, **kwargs):
    users_models.UserProfile.objects.get_or_create(user_id=instance.pk)


def register_signal_handlers():
    signals.post_save.connect(
        create_user_profile,
        sender=auth.get_user_model(),
        dispatch_uid="create_user_profile",
    )
