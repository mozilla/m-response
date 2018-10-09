from django.urls import path

from mresponse.responses.api import views as responses_views

urlpatterns = [
    path('', responses_views.CreateResponse.as_view(), name='create_response'),
]
