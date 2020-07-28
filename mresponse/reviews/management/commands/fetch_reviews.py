import logging
import time
from datetime import datetime, timedelta

import pytz
import requests

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from mresponse.applications.models import Application, ApplicationVersion
from mresponse.reviews.models import Review

logger = logging.getLogger("mresponse.reviews.fetch_reviews")


class Command(BaseCommand):
    help = "Fetches all available reviews from Google playstore"

    @transaction.atomic
    def get_reviews(self, application, days):
        logger.info("Fetching new reviews for application: %s", application)

        params = {"packageName": application.package}
        headers = {"x-api-key": settings.REVIEWS_API_KEY}
        response = requests.get(
            settings.REVIEWS_API_URL, params=params, headers=headers
        )
        response.raise_for_status()
        results = response.json()

        versions_cache = {}

        while results:
            time_of_last_review = None
            for review in results["reviews"]:
                # Reviews are returned in reverse-chronological order so this import
                # can stop importing when it reaches a target date/time. This target is
                # either the date/time of the most review we've imported before or one
                # week ago, which ever is closer to the current time.

                # Stop when we reach a review that's already imported
                if Review.objects.filter(
                    play_store_review_id=review["reviewId"]
                ).exists():
                    return

                if len(review["comments"]) == 1:
                    comment = review["comments"][0]["userComment"]
                    kwargs = {
                        "play_store_review_id": review["reviewId"],
                        "android_sdk_version": comment.get("androidOsVersion"),
                        "author_name": review.get("authorName", ""),
                        "review_text": comment["text"],
                        "review_language": comment["reviewerLanguage"],
                        "review_rating": comment["starRating"],
                        "last_modified": timezone.make_aware(
                            datetime.fromtimestamp(
                                int(comment["lastModified"]["seconds"])
                            ),
                            pytz.UTC,
                        ),
                    }

                    # Application version
                    if "appVersionCode" in comment:
                        version_code = comment["appVersionCode"]

                        if version_code not in versions_cache:
                            version, created = ApplicationVersion.objects.get_or_create(
                                application=application,
                                code=version_code,
                                defaults={"name": comment["appVersionName"]},
                            )

                            versions_cache[version_code] = version

                        kwargs["application_version"] = versions_cache[version_code]

                    # Stop when we reach a review that's older than `days`
                    if kwargs["last_modified"] < timezone.now() - timedelta(days=days):
                        return

                    obj = Review(**kwargs)
                    obj.application = application
                    obj.save()

                    time_of_last_review = kwargs["last_modified"]
                else:
                    num_of_comments = len(review["comments"])
                    review_id = review["reviewId"]
                    logger.info(
                        "Not fetching review: {}. Num of comments: {}".format(
                            review_id, num_of_comments
                        )
                    )

            if len(results["reviews"]) > 0:
                logger.info(
                    "Fetched %d reviews (%s)",
                    len(results["reviews"]),
                    time_of_last_review,
                )
            else:
                logger.info("Fetched 0 reviews")

            try:
                nextPageToken = results["tokenPagination"]["nextPageToken"]
            except KeyError:
                return

            # Sleep for a minute
            logger.info("Sleep for a minute before next request")
            time.sleep(60)

            params = {"packageName": application.package, "token": nextPageToken}
            response = requests.get(
                settings.REVIEWS_API_URL, params=params, headers=headers
            )
            response.raise_for_status()
            results = response.json()

    def add_arguments(self, parser):
        parser.add_argument(
            "--days", type=int, default=7, help="Days to go back when fetching reviews"
        )

    def handle(self, *args, **kwargs):
        for application in Application.objects.filter(is_archived=False):
            self.get_reviews(application, kwargs["days"])
