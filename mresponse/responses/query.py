from django.db import models


class ResponseQuerySet(models.QuerySet):
    def annotate_moderations_count(self):
        return self.annotate(num_moderations=models.Count('moderations'))

    def not_approved(self):
        return self.filter(approved=False)

    def moderator_queue(self):
        return self.not_approved()

    def no_moderations(self):
        return self.annotate_moderations_count().filter(num_moderations=0)

    def one_moderation(self):
        return self.annotate_moderations_count().filter(num_moderations=1)

    def two_or_more_moderations(self):
        return self.annotate_moderations_count().filter(num_moderations__gte=2)
