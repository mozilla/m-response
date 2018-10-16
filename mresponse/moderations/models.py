from django.conf import settings
from django.core import validators
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

KARMA_MIN_VALUE = 0
KARMA_MAX_VALUE = 20


class Moderation(models.Model):
    response = models.ForeignKey(
        'responses.Response',
        models.PROTECT,
        related_name='moderations',
    )
    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.PROTECT,
        related_name='moderations'
    )
    positive_in_tone = models.BooleanField(
        verbose_name=_('is the response positive in tone?')
    )
    addressing_the_issue = models.BooleanField(
        verbose_name=_('is the response addressing the issue?')
    )
    personal = models.BooleanField(
        verbose_name=_('is the response personal?')
    )
    karma_points = models.PositiveSmallIntegerField(
        validators=(
            validators.MinValueValidator(KARMA_MIN_VALUE),
            validators.MaxValueValidator(KARMA_MAX_VALUE),
        )
    )
    submitted_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return str(_('Moderation'))
