from django.urls import path

from mresponse.leaderboard.api.views import LeaderboardView

urlpatterns = [path("", LeaderboardView.as_view(), name="leaderboard")]
