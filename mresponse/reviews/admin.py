from django.contrib import admin
from mresponse.reviews import models as reviews_models


@admin.register(reviews_models.Review)
class ReviewAdmin(admin.ModelAdmin):
    readonly_fields = ('android_version',)
