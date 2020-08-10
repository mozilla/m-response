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
        # Generate a leaderboard since Monday last week till Sunday that week.
        start = today - timezone.timedelta(days=today.weekday(), weeks=1)
        end = start + timezone.timedelta(days=6)
        start = datetime.datetime.combine(start, datetime.time.min)
        end = datetime.datetime.combine(end, datetime.time.max)

        leaderboard = self.create()

        records = {}

        def get_or_create_record(user):
            records.setdefault(
                user.pk, LeaderboardRecord(leaderboard=leaderboard, user=user)
            )
            return records[user.pk]

        # Get responses
        this_weeks_responses = (
            Response.objects.filter(submitted_at__gte=start, submitted_at__lte=end)
            .select_related("author")
            .order_by("author_id")
        )

        for response in this_weeks_responses:
            record = get_or_create_record(response.author)
            record.score += POINT_PER_RESPONSE

        # Get moderations
        this_weeks_moderations = (
            Moderation.objects.filter(submitted_at__gte=start, submitted_at__lte=end)
            .select_related("moderator", "response")
            .order_by("moderator_id")
        )

        for moderation in this_weeks_moderations:
            if moderation.moderator == moderation.response.author:
                # don't count self moderations towards score
                continue
            record = get_or_create_record(moderation.moderator)
            record.score += POINT_PER_MODERATION

        # Get approvals
        this_weeks_approvals = (
            Approval.objects.filter(approved_at__gte=start, approved_at__lte=end)
            .select_related("approver", "response")
            .order_by("approver_id")
        )

        for approval in this_weeks_approvals:
            if approval.approver == approval.response.author:
                # don't count self approvals towards score
                continue
            record = get_or_create_record(approval.approver)
            record.score += POINT_PER_MODERATION

        # Create leaderboard results.
        LeaderboardRecord.objects.bulk_create(records.values())

        return leaderboard
