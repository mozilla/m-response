from django.urls import path

from mresponse.moderations.api import views

urlpatterns = [
    path(
        'create/<int:response_pk>/',
        views.CreateModeration.as_view(),
        name='create_moderation'
    ),
    path(
        'approve/<int:response_pk>/',
        views.ApproveResponse.as_view(),
        name='approve'
    ),
]
