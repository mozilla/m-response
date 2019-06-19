from django.contrib.auth import get_user_model

from rest_framework import serializers

from mresponse.leaderboard.models import Leaderboard, LeaderboardRecord


class LeaderboardUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='profile.name')
    avatar = serializers.CharField(source='profile.avatar')

    class Meta:
        model = get_user_model()
        fields = ('id', 'name', 'avatar', )


class LeaderboardRecordSerializer(serializers.ModelSerializer):
    user = LeaderboardUserSerializer()

    class Meta:
        model = LeaderboardRecord
        fields = ('id', 'score', 'user',)


class LeaderboardSerializer(serializers.ModelSerializer):
    records = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.records_limit = kwargs.pop('records_limit', 10)
        super().__init__(*args, **kwargs)

    class Meta:
        model = Leaderboard
        fields = ('id', 'date', 'records', )

    def get_records(self, instance):
        records = instance.records.order_by('-score')[:self.records_limit]
        return LeaderboardRecordSerializer(records, many=True).data
