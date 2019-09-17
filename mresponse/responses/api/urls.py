from django.urls import path

from mresponse.responses.api import views as responses_views

urlpatterns = [
    path('', responses_views.ListResponse.as_view(), name='list_response'),
    path('<int:review_pk>/', responses_views.RetrieveUpdateResponse.as_view(), name='get_response'),
    path('create/<int:review_pk>/', responses_views.CreateResponse.as_view(), name='create_response'),
    path('skip/<int:response_pk>/', responses_views.SkipResponse.as_view(), name='skip_response'),
]
