from django.urls import path

from mresponse.homepage.api import views as homepage_views

urlpatterns = [
    path('', homepage_views.homepage, name='homepage'),
]
