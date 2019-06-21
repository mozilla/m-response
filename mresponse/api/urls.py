from django.urls import include, path

from mresponse.api import views

urlpatterns = [
    path('', views.api_root),
    path('config/', views.Config.as_view(), name='config'),
    path('review/', include('mresponse.reviews.api.urls')),
    path('response/', include('mresponse.responses.api.urls')),
    path('moderation/', include('mresponse.moderations.api.urls')),
    path('users/', include('mresponse.users.api.urls')),
    path('images/', include('mresponse.images.api.urls', namespace='images')),
    path('homepage/', include('mresponse.homepage.api.urls')),
    path('leaderboard/', include('mresponse.leaderboard.api.urls')),
]
