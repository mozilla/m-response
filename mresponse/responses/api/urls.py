from django.urls import path

from mresponse.responses.api import views as responses_views

urlpatterns = [
    path('', responses_views.GetResponse.as_view(), name='get_response'),
    path('create/<int:review_pk>/', responses_views.CreateResponse.as_view(), name='create_response'),
]
