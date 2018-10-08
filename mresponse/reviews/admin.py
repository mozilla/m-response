from django.contrib import admin
from mresponse.reviews import models as reviews_models


@admin.register(reviews_models.Review)
class AuthorAdmin(admin.ModelAdmin):
    pass
