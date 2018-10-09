from django.urls import path

from mresponse.reviews.api import views

urlpatterns = [
    path('', views.Review.as_view(), name='get_review'),
]
