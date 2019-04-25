from django.conf import settings
from django.db import models

from .constants import (
    FIRST_LEVEL_TRUSTED_CONTRIBUTOR, SECOND_LEVEL_TRUSTED_CONTRIBUTOR
)


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        models.CASCADE,
        related_name='profile'
    )
    karma_points = models.PositiveIntegerField(default=0)
    languages = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    avatar = models.CharField(max_length=500)

    def __str__(self):
        return str(self.user)

    @property
    def response_count(self):
        return self.user.responses.count()

    @property
    def moderation_count(self):
        return self.user.moderations.count()

    @property
    def can_skip_response_moderation(self):
        """
        Returns whether responses submitted by the user need to be community
        moderated, according to membership of the appropriate user Group(s).
        """
        return self.user.groups.filter(name__in=[
            FIRST_LEVEL_TRUSTED_CONTRIBUTOR, SECOND_LEVEL_TRUSTED_CONTRIBUTOR
        ]).exists()
