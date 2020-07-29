from django.test import TestCase
from unittest.mock import patch, call

from mresponse.responses.tests.factories import ApplicationFactory

from mresponse.reviews.management.commands.fetch_reviews import Command


class TestFetchReviews(TestCase):
    @patch("mresponse.reviews.management.commands.fetch_reviews.Command.get_reviews")
    def test_handle_all_apps(self, mock_get_reviews):
        app1 = ApplicationFactory()
        app2 = ApplicationFactory(name="Thunderbird", package="org.mozilla.thunderbird")

        Command().handle(days=7)

        self.assertCountEqual(
            mock_get_reviews.mock_calls, [call(app1, 7), call(app2, 7)]
        )

    @patch("mresponse.reviews.management.commands.fetch_reviews.Command.get_reviews")
    def test_dont_handle_archived_apps(self, mock_get_reviews):
        ApplicationFactory(
            name="Thunderbird", package="org.mozilla.thunderbird", is_archived=True
        )
        app = ApplicationFactory()

        Command().handle(days=7)

        self.assertCountEqual(mock_get_reviews.mock_calls, [call(app, 7)])
