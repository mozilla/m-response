import datetime

from django.conf import settings
from django.db import models, transaction
from django.utils import timezone

from mresponse.leaderboard.query import LeaderboardQuerySet
from mresponse.moderations.models import Moderation
from mresponse.responses.models import Response

POINT_PER_MODERATION = 0.5
POINT_PER_RESPONSE = 0.5


class LeaderboardManager(models.Manager):
    @transaction.atomic
    def generate_weekly_leaderboard(self):
        today = timezone.now().date()
        start = today - timezone.timedelta(days=today.weekday())
        end = start + timezone.timedelta(days=6)
        start = datetime.datetime.combine(start, datetime.time.min)
        end = datetime.datetime.combine(end, datetime.time.max)

        leaderboard = self.create()

        records = {}

        # Get responses
        this_weeks_responses = Response.objects.filter(
            submitted_at__gte=start, submitted_at__lte=end).select_related(
                'author').order_by('author_id')

        for response in this_weeks_responses:
            records.setdefault(
                response.author_id,
                LeaderboardRecord(leaderboard=leaderboard,
                                  user=response.author))
            record = records[response.author_id]
            record.score += POINT_PER_RESPONSE

        # Get moderations
        this_weeks_moderations = Moderation.objects.filter(
            submitted_at__gte=start, submitted_at__lte=end).select_related(
                'moderator').order_by('moderator_id')

        for moderation in this_weeks_moderations:
            records.setdefault(
                moderation.moderator_id,
                LeaderboardRecord(leaderboard=leaderboard,
                                  user=moderation.moderator))
            record = records[moderation.moderator_id]
            record.score += POINT_PER_MODERATION

        # Create leaderboard results
        LeaderboardRecord.objects.bulk_create(records.values())

        return leaderboard


class Leaderboard(models.Model):
    date = models.DateField(default=timezone.localdate)

    objects = LeaderboardManager.from_queryset(LeaderboardQuerySet)()

    def __str__(self):
        return f'Leaderboard on {date}'

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
