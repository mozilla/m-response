import pytz
from datetime import datetime, timedelta
from django.conf import settings
from django.db import models
from django.db.models import Count, Q
from django.utils.functional import cached_property
from django.utils.timezone import now

from mresponse.utils.math import change_calculation

STATS_ROLLING_WINDOW_SIZE = 7  # Days


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        models.CASCADE,
        related_name='profile'
    )
    karma_points = models.PositiveIntegerField(default=0)
    languages = models.CharField(max_length=500)
    name = models.CharField(max_length=500)
    avatar = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return str(self.user)

    @property
    def response_count(self):
        return self.user.responses.count()

    @property
    def moderation_count(self):
        return self.user.moderations.count()

    @property
    def can_skip_community_response_moderation(self):
        """
        Returns whether responses submitted by the user need to be community
        moderated.
        """
        return (self.user.has_perm('responses.can_bypass_community_moderation')
                or self.user.has_perm('responses.can_bypass_staff_moderation')
                )

    @cached_property
    def profile_stats(self):
        from mresponse.moderations.models import Moderation

        current_window_start = datetime.combine((now() - timedelta(days=STATS_ROLLING_WINDOW_SIZE)).date(),
                                                datetime.min.time(), pytz.UTC)

        start_previous_window = current_window_start - timedelta(days=STATS_ROLLING_WINDOW_SIZE)
        end_previous_window = current_window_start
        current = Moderation.objects.filter(response__author=self.user,
                                            submitted_at__gte=current_window_start).aggregate(
            total_moderations_count=Count('id'),
            positive_in_tone_count=Count('id', filter=Q(positive_in_tone=True)),
            addressing_the_issue_count=Count('id', filter=Q(addressing_the_issue=True)),
            personal_count=Count('id', filter=Q(personal=True)),
        )

        previous = Moderation.objects.filter(response__author=self.user, submitted_at__lt=end_previous_window,
                                             submitted_at__gte=start_previous_window).aggregate(
            total_moderations_count=Count('id'),
            positive_in_tone_count=Count('id', filter=Q(positive_in_tone=True)),
            addressing_the_issue_count=Count('id', filter=Q(addressing_the_issue=True)),
            personal_count=Count('id', filter=Q(personal=True)),
        )

        return dict(
            current_count=current['total_moderations_count'],
            previous_count=previous['total_moderations_count'],
            positive_in_tone_count=current['positive_in_tone_count'],
            positive_in_tone_change=change_calculation(
                previous['positive_in_tone_count'], current['positive_in_tone_count']),
            addressing_the_issue_count=current['addressing_the_issue_count'],
            addressing_the_issue_change=change_calculation(
                previous['addressing_the_issue_count'], current['addressing_the_issue_count']),
            personal_count=current['personal_count'],
            personal_change=change_calculation(
                previous['personal_count'], current['personal_count']))
