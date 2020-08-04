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
    def get_reviews(self, application, hours=0, force=False, sleep=0):
        logger.info("Fetching new reviews for application: %s", application)

        params = {"packageName": application.package}
        headers = {"x-api-key": settings.REVIEWS_API_KEY}
        response = requests.get(
            settings.REVIEWS_API_URL, params=params, headers=headers
        )
        response.raise_for_status()
        results = response.json()

        versions_cache = {}

        stop_at = timezone.now() - timedelta(hours=hours)
        stopping_at_review = False
        if not force:
            try:
                stop_at = (
                    Review.objects.filter(created_on__isnull=False)
                    .filter(application=application)
                    .latest("created_on")
                    .created_on
                )
                stopping_at_review = True
            except Review.DoesNotExist:
                pass

        while results:
            time_of_last_review = None
            for review in results["reviews"]:
                # Reviews are returned in reverse-chronological order so this import
                # can stop importing when it reaches a target date/time. This target is
                # either the created_on datetime of the most recent review prior to this
                # run or the hours argument, whichever is closer to the current time.

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

                    # we're done parsing results - exit
                    if last_modified < stop_at:
                        if stopping_at_review:
                            logger.info(
                                "Reached review older than the most recent review we knew of prior to this run. "
                                "Stopping."
                            )
                        else:
                            logger.info(
                                "Reached review older than {} hours. Stopping.".format(
                                    hours
                                )
                            )
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

            logger.info("Sleep for {} seconds before next request".format(sleep))
            time.sleep(sleep)

            params = {"packageName": application.package, "token": nextPageToken}
            response = requests.get(
                settings.REVIEWS_API_URL, params=params, headers=headers
            )
            response.raise_for_status()
            results = response.json()

    def add_arguments(self, parser):
        parser.add_argument(
            "--hours",
            type=int,
            default=168,
            help="Hours to go back when fetching reviews",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Don't stop when we hit a review older than the most recent review we currently know of",
        )
        parser.add_argument(
            "--sleep",
            type=int,
            default=60,
            help="Seconds to sleep between API requests",
        )

    def handle(self, *args, **kwargs):
        for application in Application.objects.filter(is_archived=False):
            self.get_reviews(
                application,
                hours=kwargs["hours"],
                force=kwargs["force"],
                sleep=kwargs["sleep"],
            )
