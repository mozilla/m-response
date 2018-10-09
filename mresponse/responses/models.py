from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _


class Response(models.Model):
    review = models.OneToOneField(
        'reviews.Review',
        models.PROTECT,
        related_name='response'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.PROTECT,
        related_name='+'
    )
    text = models.TextField()
    submitted_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return _('Response to review #%(review_id)s') % {
            'review_id': self.review.play_store_review_id,
        }
