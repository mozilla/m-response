from django.urls import path

from . import views

app_name = 'images'
urlpatterns = [
    path('upload/', views.Upload.as_view(), name='upload'),
]
