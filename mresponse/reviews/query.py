from django.db import models
from django.utils import timezone

ASSIGNMENT_TIMEOUT = timezone.timedelta(minutes=20)


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
        return self.assignment_not_expired() & self.filter(assigned_to=user)

    def assignment_not_expired(self):
        return self.filter(assigned_to_user_at__gte=timezone.now() - ASSIGNMENT_TIMEOUT)

    def assignment_expired(self):
        return self.difference(self.assignment_not_expired())

    def not_assigned_to_any_user(self):
        return self.filter(assigned_to__isnull=True) | self.assignment_expired()

    def rating_range(self, min_value, max_value):
        return self.filter(review_rating__gte=min_value, review_rating__lte=max_value)

    def newer_than_1_week(self):
        one_week_ago = timezone.now() - timezone.timedelta(weeks=1)
        return self.filter(last_modified__gte=one_week_ago)

    def responder_queue(self, user=None):
        qs = (
            self.unresponded()
            & self.rating_range(1, 2)
            & self.not_assigned_to_any_user()
        )
        if user is not None:
            qs = qs | self.assigned_to_user(user)
        return qs

    def language_q(self, language_string):
        return (
            models.Q(review_language__istartswith=f"{language_string}_")
            | models.Q(review_language__istartswith=f"{language_string}-")
            | models.Q(review_language__iexact=language_string)
        )

    def languages(self, languages_list):
        if not languages_list:
            raise ValueError("must provide at least one language")
        q = models.Q()
        for lang in languages_list:
            q |= self.language_q(lang)
        return self.filter(q)
