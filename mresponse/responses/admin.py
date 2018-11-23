from django.contrib import admin
from django.db.models import Count, Q

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


class ModerationsCountFilter(admin.SimpleListFilter):
    title = 'num. of moderations'
    parameter_name = 'moderations'

    def lookups(self, request, model_admin):
        return (
            ('yes', '3'),
            ('no', 'Less than 3')
        )

    def queryset(self, request, queryset):
        qs = queryset.annotate(total_moderations_count=Count('moderations'))
        if self.value() == 'yes':
            qs = qs.filter(total_moderations_count__gte=3)
        if self.value() == 'no':
            qs = qs.filter(total_moderations_count__lt=3)
        return qs.distinct()


class PositiveToneCountFilter(admin.SimpleListFilter):
    title = 'positive tone'
    parameter_name = 'positive_tone'

    def lookups(self, request, model_admin):
        return (
            ('yes', '3'),
            ('no', 'Less than 3')
        )

    def queryset(self, request, queryset):
        qs = queryset.annotate(
            positive_in_tone_count=Count('moderations', filter=Q(
                moderations__positive_in_tone=True)
            ))

        if self.value() == 'yes':
            qs = qs.filter(positive_in_tone_count__gte=3)
        if self.value() == 'no':
            qs = qs.filter(positive_in_tone_count__lt=3)
        return qs.distinct()


class AddressingIssueCountFilter(admin.SimpleListFilter):
    title = 'addressing issue'
    parameter_name = 'addressing_issue'

    def lookups(self, request, model_admin):
        return (
            ('yes', '2'),
            ('no', 'Less than 2')
        )

    def queryset(self, request, queryset):
        qs = queryset.annotate(
            addressing_the_issue_count=Count('moderations', filter=Q(
                moderations__addressing_the_issue=True))
        )

        if self.value() == 'yes':
            qs = qs.filter(addressing_the_issue_count__gte=2)
        if self.value() == 'no':
            qs = qs.filter(addressing_the_issue_count__lt=2)
        return qs.distinct()


class PersonalCountFilter(admin.SimpleListFilter):
    title = 'Personalized'
    parameter_name = 'personal_count'

    def lookups(self, request, model_admin):
        return (
            ('yes', '1'),
            ('no', 'Less than 1')
        )

    def queryset(self, request, queryset):
        qs = queryset.annotate(
            personal_count=Count('moderations', filter=Q(
                moderations__personal=True))
        )

        if self.value() == 'yes':
            qs = qs.filter(personal_count__gte=1)
        if self.value() == 'no':
            qs = qs.filter(personal_count__lt=1)
        return qs.distinct()


@admin.register(responses_models.Response)
class ResponseAdmin(admin.ModelAdmin):
    inlines = (ModerationInline,)
    readonly_fields = ['submitted_at']
    list_display = (
        'pk',
        'get_review_text',
        'get_review_rating',
        'text',
        'approved',
        'staff_approved',
        'submitted_to_play_store',
    )
    list_filter = (
        ModerationsCountFilter, PositiveToneCountFilter,
        AddressingIssueCountFilter, PersonalCountFilter
    )
    actions = [staff_approve_responses]

    def get_review_text(self, obj):
        return obj.review.review_text

    get_review_text.short_description = 'Review'

    def get_review_rating(self, obj):
        return obj.review.review_rating

    get_review_rating.short_description = 'Rating'
