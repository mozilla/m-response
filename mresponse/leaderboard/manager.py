import datetime

from django.db import models, transaction
from django.utils import timezone

from mresponse.moderations.models import Approval, Moderation
from mresponse.responses.models import Response

POINT_PER_MODERATION = 1
POINT_PER_RESPONSE = 1


class LeaderboardManager(models.Manager):
    @transaction.atomic
    def generate_weekly_leaderboard(self):
        from mresponse.leaderboard.models import LeaderboardRecord

        today = timezone.now().date()
        start = today - timezone.timedelta(days=today.weekday())
        end = start + timezone.timedelta(days=6)
        start = datetime.datetime.combine(start, datetime.time.min)
        end = datetime.datetime.combine(end, datetime.time.max)

        leaderboard = self.create()

        records = {}

        def get_or_create_record(user):
            records.setdefault(user.pk, LeaderboardRecord(
                leaderboard=leaderboard, user=user)
            )
            return records[user.pk]

        # Get responses
        this_weeks_responses = Response.objects.filter(
            submitted_at__gte=start, submitted_at__lte=end
        ).select_related('author').order_by('author_id')

        for response in this_weeks_responses:
            record = get_or_create_record(response.author)
            record.score += POINT_PER_RESPONSE

        # Get moderations
        this_weeks_moderations = Moderation.objects.filter(
            submitted_at__gte=start, submitted_at__lte=end).select_related(
                'moderator').order_by('moderator_id')

        for moderation in this_weeks_moderations:
            record = get_or_create_record(moderation.moderator)
            record.score += POINT_PER_MODERATION

        # Get approvals
        this_weeks_approvals = Approval.objects.filter(
            approved_at__gte=start, approved_at__lte=end).select_related(
                'approver').order_by('approver_id')

        for approval in this_weeks_approvals:
            record = get_or_create_record(approval.approver)
            record.score += POINT_PER_MODERATION

        # Create leaderboard results.
        LeaderboardRecord.objects.bulk_create(records.values())

        return leaderboard
