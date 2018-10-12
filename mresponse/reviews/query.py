from django.db import models
from django.utils import timezone


class ReviewQuerySet(models.QuerySet):
    def unresponded_q(self):
        return models.Q(response__isnull=True)

    def unresponded(self):
        """
        Get reviews that have no response.
        """
        return self.filter(self.unresponded_q())

    def assigned_to_user(self, user):
        """
        Get reviews that are assigned to a particular user.
        """
        return self.filter(self.assigned_to_user_q(user))

    def assigned_to_user_q(self, user):
        # TODO: Add a logic that only allows to get a review for that user.
        return models.Q()

    def rating_range_q(self, min_value, max_value):
        return models.Q(
            review_rating__gte=min_value,
            review_rating__lte=max_value
        )

    def newer_than_6_months_q(self):
        six_months_ago = timezone.now() - timezone.timedelta(weeks=52 / 12 * 6)
        return models.Q(last_modified__gte=six_months_ago)

    def responder_queue_q(self, user=None):
        query = (
            self.unresponded_q()
            & self.rating_range_q(1, 2)
            & self.newer_than_6_months_q()
        )
        if user is not None:
            query = query | self.assigned_to_user_q(user)
        return query

    def responder_queue(self, user=None):
        return (
            self.filter(self.responder_queue_q(user=user))
                .order_by('review_rating', '-last_modified')
        )
