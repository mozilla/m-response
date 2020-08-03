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
        last_review_saved = (
            Review.objects.filter(created_on__isnull=False)
            .latest("created_on")
            .created_on
        )
        if not last_review_saved:
            last_review_saved = timezone.now() - timedelta(hours=(days * 24))

        while results:
            time_of_last_review = None
            for review in results["reviews"]:
                # Reviews are returned in reverse-chronological order so this import
                # can stop importing when it reaches a target date/time. This target is
                # either the date/time of the most review we've imported before or one
                # week ago, which ever is closer to the current time.

                if len(review["comments"]) == 1:
                    comment = review["comments"][0]["userComment"]
                    last_modified = datetime.fromtimestamp(
                        int(comment["lastModified"]["seconds"]), pytz.UTC
                    )
                    kwargs = {
                        "play_store_review_id": review["reviewId"],
                        "android_sdk_version": comment.get("androidOsVersion"),
                        "author_name": review.get("authorName", ""),
                        "review_text": comment["text"],
                        "review_language": comment["reviewerLanguage"],
                        "review_rating": comment["starRating"],
                        "last_modified": last_modified,
                    }

                    # we 're done parsing results - exit
                    if last_modified < last_review_saved:
                        logger.info("Time limit reached. Stopping.")
                        return

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

                    # Create a new review or update an exising one
                    kwargs.update({"application": application})
                    obj, created = Review.objects.get_or_create(
                        play_store_review_id=kwargs["play_store_review_id"],
                        defaults=kwargs,
                    )
                    obj.created_on = last_modified
                    if not created:
                        obj.created_on = obj.last_modified
                        obj.last_modified = last_modified
                        # TODO: we need to update the values and also account for reviews already submitted
                        # for moderation
                        # obj.review_rating = kwargs['review_rating']
                        # obj.review_text = kwargs['review_text']
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
