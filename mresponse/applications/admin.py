from django.contrib import admin

from mresponse.applications import models as applications_models


@admin.register(applications_models.Application)
class ApplicationAdmin(admin.ModelAdmin):
    pass


@admin.register(applications_models.ApplicationVersion)
class ApplicationVersionAdmin(admin.ModelAdmin):
    pass
