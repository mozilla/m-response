from django.urls import path

from mresponse.users.api import views as users_views

urlpatterns = [
    path('me/', users_views.MyUser.as_view(), name='my_user'),
    path('me/usermeta/', users_views.MyUserMeta.as_view(), name='my_usermeta'),
    path('me/logout/', users_views.logout, name='my_logout')
]
