from django.contrib import admin
from django.template.defaultfilters import truncatechars

from . import models


@admin.register(models.Page)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("title", "truncated_body")

    def truncated_body(self, obj):
        return truncatechars(obj.body, 100)

    truncated_body.admin_order_field = "body"
    truncated_body.short_description = "Body"
