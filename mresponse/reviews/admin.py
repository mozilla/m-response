from django.contrib import admin

from mresponse.responses import models as responses_models
from mresponse.reviews import models as reviews_models
from mresponse.utils import admin as admin_utils


class ResponseInline(admin_utils.ViewOnlyModelAdmin, admin.StackedInline):
    model = responses_models.Response
    show_change_link = True
    readonly_fields = ['submitted_at']


@admin.register(reviews_models.Review)
class ReviewAdmin(admin.ModelAdmin):
    readonly_fields = ('android_version',)
    inlines = (ResponseInline,)
