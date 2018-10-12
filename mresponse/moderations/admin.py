from django.contrib import admin

from mresponse.moderations import models as moderations_models


@admin.register(moderations_models.Moderation)
class ModerationAdmin(admin.ModelAdmin):
    readonly_fields = ['submitted_at']
