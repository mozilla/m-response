from django.db import models


class ResponseQuerySet(models.QuerySet):
    def moderator_queue_q(self):
        return ~self.approved_q()

    def approved_q(self):
        return models.Q(approved=True)

    def moderator_queue(self):
        return self.filter(self.moderator_queue_q())
