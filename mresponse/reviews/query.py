from django.db import models
from django.utils import timezone


class ReviewQuerySet(models.QuerySet):
    def unresponded(self):
        """
        Get reviews that have no response.
        """
        return self.filter(response__isnull=True)

    def assigned_to_user(self, user):
        """
        Get reviews that are assigned to a particular user.
        """
        # TODO: Add a logic that only allows to get a review for that user.
        return self.none()

    def rating_range(self, min_value, max_value):
        return self.filter(
            review_rating__gte=min_value,
            review_rating__lte=max_value
        )

    def newer_than_6_months(self):
        six_months_ago = timezone.now() - timezone.timedelta(weeks=52 / 12 * 6)
        return self.filter(last_modified__gte=six_months_ago)

    def responder_queue(self):
        qs = self.unresponded().rating_range(1, 2).newer_than_6_months()
        # 1 star reviews first. Prefer newer reviews.
        return qs.order_by('review_rating', '-last_modified')
