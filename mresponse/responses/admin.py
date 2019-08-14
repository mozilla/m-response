import csv
from datetime import timedelta

from django.contrib import admin, messages
from django.db.models import Count, Q
from django.http import HttpResponse
from django.utils import timezone

from import_export import resources
from import_export.admin import ExportMixin
from import_export.fields import Field

from mresponse.moderations import models as moderations_models
from mresponse.responses import models as responses_models
from mresponse.utils import admin as admin_utils
from mresponse.utils.queryset import PlaystoreUploadException


class ModerationInline(admin_utils.ViewOnlyModelAdmin, admin.StackedInline):
    extra = 0
    model = moderations_models.Moderation
    show_change_link = True
    readonly_fields = ['submitted_at']


class ApprovalInline(admin_utils.ViewOnlyModelAdmin, admin.StackedInline):
    extra = 0
    model = moderations_models.Approval
    show_change_link = True
    readonly_fields = ['approved_at']


def staff_approve_responses(modeladmin, request, qs):
    qs.update(staff_approved=True)


staff_approve_responses.short_description = 'Approve responses (staff)'


def get_activity_csv(modeladmin, request, qs):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="activity.csv"'
    writer = csv.writer(response)
    writer.writerow([
        'active_users', 'responses_submitted', 'responses_pass', 'responses_declined',
        'responses_queued', 'responses_staff_approved'
    ])

    last_week = timezone.now() - timedelta(days=7)
    responses = responses_models.Response.objects.all()
    moderations = moderations_models.Moderation.objects.all()
    responses_last_week = responses.filter(submitted_at__gte=last_week)
    moderations_last_week = moderations.filter(submitted_at__gte=last_week)
    users_pk = []
    users_pk += list(moderations_last_week.values_list('moderator', flat=True))
    users_pk += list(responses_last_week.values_list('author', flat=True))
    active_users = len(set(users_pk))
    responses_submitted = responses.count()
    responses_pass = responses.pass_criteria().count()
    responses_queued = responses.two_or_less_moderations().count()
    responses_declined = responses.annotate_pass_criteria().filter(
        total_moderations_count__gte=3,
        positive_in_tone_count__lt=3,
        addressing_the_issue_count__lt=2,
        personal_count__lt=1
    ).count()
    responses_staff_approved = responses.filter(staff_approved=True).count()

    writer.writerow([
        active_users, responses_submitted, responses_pass, responses_declined,
        responses_queued, responses_staff_approved
    ])

    return response


get_activity_csv.short_description = 'Get activity CSV'


def upload_to_playstore(modeladmin, request, qs):
    for obj in qs:
        try:
            obj.submit_to_play_store()
        except PlaystoreUploadException as e:
            messages.error(request, str(e))


upload_to_playstore.short_description = 'Upload to playstore'


class ModerationsCountFilter(admin.SimpleListFilter):
    title = 'num. of moderations'
    parameter_name = 'moderations'

    def lookups(self, request, model_admin):
        return (
            ('yes', '3 or more - pass'),
            ('no', 'Less than 3 - fail')
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
            ('yes', '3 or more - pass'),
            ('no', 'Less than 3 - fail')
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
            ('yes', '2 or more - pass'),
            ('no', 'Less than 2 - fail')
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
    title = 'personalized'
    parameter_name = 'personal_count'

    def lookups(self, request, model_admin):
        return (
            ('yes', '1 or more - pass'),
            ('no', 'Less than 1 - fail')
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


class ModeratorResponseFilter(admin.SimpleListFilter):
    title = 'moderator responses'
    parameter_name = 'from_moderator'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'from moderator'),
            ('no', 'not from moderator')
        )

    def queryset(self, request, queryset):
        group_name = 'Moderator 1'

        if self.value() == 'yes':
            return queryset.filter(author__groups__name=group_name).distinct()
        if self.value() == 'no':
            return queryset.exclude(author__groups__name=group_name).distinct()
        return queryset


class ResponseResource(resources.ModelResource):
    review_text = Field()
    review_rating = Field()
    community_approved = Field()
    total_moderations_count = Field(attribute='total_moderations_count')
    positive_in_tone_count = Field(attribute='positive_in_tone_count')
    addressing_the_issue_count = Field(attribute='addressing_the_issue_count')
    personal_count = Field(attribute='personal_count')

    class Meta:
        model = responses_models.Response
        fields = (
            'id', 'text', 'staff_approved', 'submitted_to_play_store'
        )

    def get_export_queryset(self, *args, **kwargs):
        qs = super(ResponseResource, self).get_export_queryset(*args, **kwargs)
        return qs.annotate_moderation_criteria()

    def dehydrate_review_text(self, obj):
        return obj.review.review_text

    def dehydrate_review_rating(self, obj):
        return obj.review.review_rating

    def dehydrate_community_approved(self, obj):
        criteria = [
            obj.total_moderations_count >= 3,
            obj.positive_in_tone_count >= 3,
            obj.addressing_the_issue_count >= 2,
            obj.personal_count >= 1
        ]
        return all(criteria)


@admin.register(responses_models.Response)
class ResponseAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = ResponseResource
    inlines = (ModerationInline, ApprovalInline, )
    readonly_fields = ['submitted_at']
    list_display = (
        'pk',
        'get_review_text',
        'get_review_rating',
        'text',
        'staff_approved',
        'submitted_to_play_store',
    )
    list_filter = (
        ModerationsCountFilter, PositiveToneCountFilter,
        AddressingIssueCountFilter, PersonalCountFilter,
        ModeratorResponseFilter
    )
    actions = [
        staff_approve_responses,
        get_activity_csv,
        upload_to_playstore
    ]

    def get_review_text(self, obj):
        return obj.review.review_text

    get_review_text.short_description = 'Review'

    def get_review_rating(self, obj):
        return obj.review.review_rating

    get_review_rating.short_description = 'Rating'
