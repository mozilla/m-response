from django.urls import include, path

from mresponse.api import views

urlpatterns = [
    path('', views.api_root),
    path('config/', views.Config.as_view(), name='config'),
    path('review/', include('mresponse.reviews.api.urls')),
    path('respond/', include('mresponse.responses.api.urls')),
    path('users/', include('mresponse.users.api.urls')),
]
