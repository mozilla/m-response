from django.urls import path

from . import views

app_name = 'documentation'
urlpatterns = [
    path('', views.PageList.as_view(), name='pages'),
]
