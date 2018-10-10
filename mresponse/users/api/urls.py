from django.urls import path

from mresponse.users.api import views as users_views

urlpatterns = [
    path('me/', users_views.MyUser.as_view(), name='my_user'),
]
