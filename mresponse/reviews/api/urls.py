from django.urls import path

from mresponse.reviews.api import views as reviews_views

urlpatterns = [
    path('', reviews_views.Review.as_view(), name='get_review'),
]
