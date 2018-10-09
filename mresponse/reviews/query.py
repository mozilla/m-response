from django.db import models


class ReviewQuerySet(models.QuerySet):
    def unresponded(self):
        return self.filter(response__isnull=True)
