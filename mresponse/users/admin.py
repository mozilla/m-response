from django.contrib import admin, auth

from mresponse.users import models as users_models

admin.site.unregister(auth.get_user_model())


class UserProfileInline(admin.StackedInline):
    model = users_models.UserProfile


@admin.register(auth.get_user_model())
class UserAdmin(auth.admin.UserAdmin):
    inlines = (UserProfileInline,)
