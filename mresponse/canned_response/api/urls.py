from django.urls import path

from . import views

app_name = 'canned_response'
urlpatterns = [
    path('', views.CategoryList.as_view(), name='categories'),
    path('<category_slug>', views.MessageList.as_view(), name='responses'),
]
