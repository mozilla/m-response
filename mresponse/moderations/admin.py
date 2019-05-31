from django.contrib import admin

from mresponse.moderations import models as moderations_models


@admin.register(moderations_models.Moderation)
class ModerationAdmin(admin.ModelAdmin):
    readonly_fields = ['submitted_at']
    list_display = (
        'pk',
        'get_review',
        'get_response',
        'get_moderator',
        'positive_in_tone',
        'addressing_the_issue',
        'personal',
        'submitted_at'
    )

    def get_moderator(self, obj):
        if obj.moderator.profile and obj.moderator.profile.name:
            return obj.moderator.profile.name
        return obj.moderator.email

    get_moderator.short_description = 'Moderator'

    def get_response(self, obj):
        return obj.response.text

    get_response.short_description = 'Response'

    def get_review(self, obj):
        return obj.response.review.review_text

    get_review.short_description = 'Review'



@admin.register(moderations_models.Approval)
class ApprovalAdmin(admin.ModelAdmin):
    pass
