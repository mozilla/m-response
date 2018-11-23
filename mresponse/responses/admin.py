from django.contrib import admin

from mresponse.moderations import models as moderations_models
from mresponse.responses import models as responses_models
from mresponse.utils import admin as admin_utils


class ModerationInline(admin_utils.ViewOnlyModelAdmin, admin.StackedInline):
    model = moderations_models.Moderation
    show_change_link = True
    readonly_fields = ['submitted_at']


def staff_approve_responses(modeladmin, request, qs):
    qs.update(staff_approved=True)


staff_approve_responses.short_description = 'Approve responses (staff)'


@admin.register(responses_models.Response)
class ResponseAdmin(admin.ModelAdmin):
    inlines = (ModerationInline,)
    readonly_fields = ['submitted_at']
    list_display = (
        'get_review_text',
        'get_review_rating',
        'text',
        'get_community_approval',
        'staff_approved',
        'submitted_to_play_store',
    )
    actions = [staff_approve_responses]

    def get_review_text(self, obj):
        return obj.review.review_text

    get_review_text.short_description = 'Review'

    def get_review_rating(self, obj):
        return obj.review.review_rating

    get_review_rating.short_description = 'Rating'

    def get_community_approval(self, obj):
        return obj.is_community_approved()

    get_community_approval.short_description = 'Approved'
