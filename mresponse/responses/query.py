from django.db import models


class ResponseQuerySet(models.QuerySet):
    def annotate_moderations_count(self):
        return self.annotate(models.Count('moderations'))

    def approved(self):
        return self.filter(approved=True)

    def moderator_queue(self):
        return self.difference(self.approved())

    def no_moderations(self):
        return self.filter(moderations__count=0)

    def one_moderation(self):
        return self.filter(moderations__count=1)

    def two_or_more_moderations(self):
        return self.filter(moderations__count__gte=2)
