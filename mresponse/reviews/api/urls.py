from django.urls import path

from mresponse.reviews.api import views as reviews_views

urlpatterns = [
    path('', reviews_views.Review.as_view(), name='get_review'),
    path('next/', reviews_views.NextReview.as_view(), name='get_next_review'),
    path('skip/<int:review_pk>/', reviews_views.SkipReview.as_view(), name='skip_review'),
]
