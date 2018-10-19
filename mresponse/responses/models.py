from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from mresponse.responses import query


class ResponseAssignedToUser(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        models.CASCADE,
        related_name='response_assignment',
    )
    response = models.ForeignKey(
        'Response',
        models.CASCADE,
        related_name='moderation_assignments'
    )
    assigned_at = models.DateTimeField(default=timezone.now)

    objects = query.ResponseAssignedToUserQuerySet.as_manager()

    @property
    def assignment_expires_at(self):
        return self.assigned_at + query.ASSIGNMENT_TIMEOUT


class Response(models.Model):
    review = models.OneToOneField(
        'reviews.Review',
        models.PROTECT,
        related_name='response'
    )
    approved = models.BooleanField(
        default=False,
        help_text=_('If response meets criteria to be submitted to the Play '
                    'Store.')
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.PROTECT,
        related_name='responses'
    )
    text = models.TextField()
    submitted_at = models.DateTimeField(default=timezone.now, editable=False)

    objects = query.ResponseQuerySet.as_manager()

    def __str__(self):
        return _('Response to review #%(review_id)s') % {
            'review_id': self.review.play_store_review_id,
        }

    def assign_to_user(self, user):
        # Free user from any expired assignments.
        ResponseAssignedToUser.objects.filter(user=user).expired().delete()

        # Create or get response assignment for that user.
        response_assignment, created = ResponseAssignedToUser.objects.get_or_create(
            user=user,
            response=self,
        )

        # If assignment already exists, update the assignment time.
        if not created:
            response_assignment.assigned_at = timezone.now()
            response_assignment.save(update_fields=('assigned_at',))
