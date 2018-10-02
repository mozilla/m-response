from django.urls import path

from mresponse.api import views


urlpatterns = [
    path('', views.api_root),
    path('config/', views.Config.as_view(), name='config'),
]
