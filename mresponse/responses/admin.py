from django.contrib import admin

from mresponse.moderations import models as moderations_models
from mresponse.responses import models as responses_models
from mresponse.utils import admin as admin_utils


class ModerationInline(admin_utils.ViewOnlyModelAdmin, admin.StackedInline):
    model = moderations_models.Moderation
    show_change_link = True
    readonly_fields = ['submitted_at']


@admin.register(responses_models.Response)
class ResponseAdmin(admin.ModelAdmin):
    inlines = (ModerationInline,)
    readonly_fields = ['submitted_at']
