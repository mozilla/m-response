from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _


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
    submitted_at = models.DateTimeField(default=timezone.now, editable=False)
    feedback_message = models.TextField(
        blank=True, help_text=_('Feedback message left by a reviewer')
    )

    def __str__(self):
        return str(_('Moderation'))


class Approval(models.Model):
    COMMUNITY = 1
    STAFF = 2
    APPROVAL_TYPE_CHOICES = (
        (COMMUNITY, _('community')),
        (STAFF, _('staff')),
    )
    response = models.ForeignKey(
        'responses.Response',
        models.PROTECT,
        related_name='approvals',
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.PROTECT,
        related_name='+'
    )
    approval_type = models.PositiveSmallIntegerField(
        choices=APPROVAL_TYPE_CHOICES
    )
    approved_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(_('Approval'))
