from django.urls import path

from . import views

app_name = "canned_response"
urlpatterns = [path("", views.CategoryList.as_view(), name="categories")]
