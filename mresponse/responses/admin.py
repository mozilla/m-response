from django.contrib import admin

from mresponse.responses import models as responses_models


@admin.register(responses_models.Response)
class ResponseAdmin(admin.ModelAdmin):
    pass
