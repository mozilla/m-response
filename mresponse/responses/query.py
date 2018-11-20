from django.db import models
from django.utils import timezone

ASSIGNMENT_TIMEOUT = timezone.timedelta(minutes=20)


class ResponseQuerySet(models.QuerySet):
    def annotate_moderations_count(self):
        return self.annotate(moderations_count=models.Count('moderations'))

    def not_approved(self):
        return self.filter(approved=False)

    def moderator_queue(self):
        return self.not_approved()

    def no_moderations(self):
        return self.annotate_moderations_count().filter(moderations_count=0)

    def one_moderation(self):
        return self.annotate_moderations_count().filter(moderations_count=1)

    def two_or_more_moderations(self):
        return self.annotate_moderations_count().filter(moderations_count__gte=2)

    def two_or_less_moderations(self):
        return self.annotate_moderations_count().filter(moderations_count__lte=2)

    def not_moderated_by(self, user):
        return self.exclude(moderations__moderator_id=user.pk)

    def not_authored_by(self, user):
        return self.exclude(author=user.pk)


class ResponseAssignedToUserQuerySet(models.QuerySet):
    def expired(self):
        return self.filter(
            assigned_at__lt=timezone.now() - ASSIGNMENT_TIMEOUT
        )

    def not_expired(self):
        return self.difference(self.expired())
