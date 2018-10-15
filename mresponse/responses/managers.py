from django.db import models


class ResponseManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().annotate_moderations_count()
