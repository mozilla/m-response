from django.contrib import admin
from django.template.defaultfilters import truncatechars

from . import models


@admin.register(models.Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("truncated_response", "category")
    list_filter = ("category",)

    def truncated_response(self, obj):
        return truncatechars(obj.text, 100)

    truncated_response.admin_order_field = "response"
    truncated_response.short_description = "Response"


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',), }
    list_display = ("name", "slug", "response_count")

    def response_count(self, obj):
        return obj.response_set.count()

    response_count.short_description = "Response(s)"
