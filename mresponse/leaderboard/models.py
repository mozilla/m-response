from django.conf import settings
from django.db import models
from django.utils import timezone

from mresponse.leaderboard.manager import LeaderboardManager
from mresponse.leaderboard.query import LeaderboardQuerySet


class Leaderboard(models.Model):
    date = models.DateField(default=timezone.localdate)

    objects = LeaderboardManager.from_queryset(LeaderboardQuerySet)()

    def __str__(self):
        return f'Leaderboard on {self.date}'

    class Meta:
        ordering = (
            '-date',
            '-pk',
        )


class LeaderboardRecord(models.Model):
    leaderboard = models.ForeignKey(Leaderboard,
                                    models.CASCADE,
                                    related_name='records')
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             models.CASCADE,
                             related_name='+')
    score = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = (
            'user',
            'leaderboard',
        )

    def __str__(self):
        return 'Leaderboard record'
