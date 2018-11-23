from django.conf import settings
from django.db import models
from django.db.models import Count, Q
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from mresponse.responses import query
from mresponse.reviews.utils import reply_to_review


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
    submitted_to_play_store = models.BooleanField(default=False)
    staff_approved = models.BooleanField(default=False)

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

    def is_community_approved(self):
        """Returns True if the response is moderated by the community"""

        # Criteria defined in https://github.com/torchbox/m-response/issues/54
        aggs = self.moderations.aggregate(
            total_moderations_count=Count('id'),
            positive_in_tone_count=Count('id', filter=Q(positive_in_tone=True)),
            addressing_the_issue_count=Count('id', filter=Q(addressing_the_issue=True)),
            personal_count=Count('id', filter=Q(personal=True)),
        )

        if aggs['total_moderations_count'] < 3:
            return False

        if aggs['positive_in_tone_count'] < 3:
            return False

        if aggs['addressing_the_issue_count'] < 2:
            return False

        if aggs['personal_count'] < 1:
            return False

        return True

    def can_submit_to_play_store(self):
        """
        Returns True if the response satisifies the moderation criteria so
        can be submitted to the Play store
        """

        if not self.is_community_approved():
            return False

        if not self.staff_approved:
            return False

        self.approved = True
        self.save(update_fields=['approved'])

        return True

    def submit_to_play_store(self):
        """
        Submits the response to the play store
        """
        if self.submitted_to_play_store:
            raise Exception("This response has already been submitted to the Play store")

        if not getattr(settings, 'PLAY_STORE_SUBMIT_REPLY_ENABLED', False):
            return

        reply_to_review(self.review.application, self.review.play_store_review_id, self.text)

        self.submitted_to_play_store = True
        self.save(update_fields=['submitted_to_play_store'])
