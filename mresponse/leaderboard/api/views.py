from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import generics

from mresponse.leaderboard.api.serializers import LeaderboardSerializer
from mresponse.leaderboard.models import Leaderboard


# Cache leaderboard for an hour
@method_decorator(cache_page(60 * 60 * 1), name='retrieve')
class LeaderboardView(generics.RetrieveAPIView):
    serializer_class = LeaderboardSerializer
    queryset = Leaderboard.objects.all()

    def get_object(self):
        try:
            return self.get_queryset().current_week()
        except Leaderboard.DoesNotExist:
            # If the leaderboard does not exist, generate a new one.
            return Leaderboard.objects.generate_weekly_leaderboard()

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()

        # Set records_limit to 10 if not set
        try:
            kwargs['records_limit'] = int(self.request.GET['records_limit'])
        except (KeyError, ValueError):
            kwargs['records_limit'] = 10

        return serializer_class(*args, **kwargs)
