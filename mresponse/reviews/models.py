from django.conf import settings
from django.db import models
from django.utils import timezone, translation
from django.utils.translation import ugettext_lazy as _

from mresponse.reviews import query as reviews_query
from mresponse.utils import android as android_utils

STAR_RATING_STRING = translation.ngettext_lazy('%d star', '%d stars')

REVIEW_RATING_CHOICES = tuple([
    (i, STAR_RATING_STRING % i)
    for i in range(1, 6)
])


class Review(models.Model):
    play_store_review_id = models.CharField(max_length=255, unique=True)
    android_sdk_version = models.PositiveSmallIntegerField(blank=True, null=True)
    author_name = models.CharField(max_length=255)
    application = models.ForeignKey(
        'applications.Application',
        models.PROTECT,
        related_name='+'
    )
    application_version = models.ForeignKey(
        'applications.ApplicationVersion',
        models.PROTECT,
        null=True,
        blank=True,
        related_name='+'
    )
    review_text = models.TextField()
    review_rating = models.SmallIntegerField(choices=REVIEW_RATING_CHOICES)
    last_modified = models.DateTimeField()
    assigned_to = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        models.PROTECT,
        related_name='+',
        null=True,
        blank=True,
    )
    assigned_to_user_at = models.DateTimeField(blank=True, null=True)

    objects = reviews_query.ReviewQuerySet.as_manager()

    def __str__(self):
        return _('Review %(review_id)s by %(review_author)s') % {
            'review_id': self.play_store_review_id,
            'review_author': self.author_name,
        }

    @property
    def android_version(self):
        return android_utils.get_human_readable_android_version(
            self.android_sdk_version
        )

    def assign_to_user(self, user):
        self.assigned_to = user
        self.assigned_to_user_at = timezone.now()
        self.save(update_fields=('assigned_to', 'assigned_to_user_at',))

    def return_to_the_queue(self):
        self.assigned_to = None
        self.assigned_to_user_at = None
        self.save(update_fields=('assigned_to', 'assigned_to_user_at',))
