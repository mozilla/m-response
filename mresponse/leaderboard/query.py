from django.db import models
from django.utils import timezone


class LeaderboardQuerySet(models.QuerySet):
    def current_week(self):
        today = timezone.now().date()
        start = today - timezone.timedelta(days=today.weekday())
        end = start + timezone.timedelta(days=6)

        return self.filter(
            date__gte=start,
            date__lte=end
        ).order_by('-date', '-pk')[:1].get()
