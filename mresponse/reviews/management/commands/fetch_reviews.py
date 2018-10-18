from datetime import datetime

from django.conf import settings
from django.core.management.base import BaseCommand

from mozapkpublisher.common.googleplay import _connect
from mresponse.applications.models import Application
from mresponse.reviews.models import Review


class Command(BaseCommand):
    help = "Fetches all available reviews from Google playstore"

    def get_reviews(self, application):
        service = _connect(settings.PLAY_ACCOUNT, settings.PLAY_CREDENTIALS_PATH)
        reviews_service = service.reviews()
        results = reviews_service.list(packageName=application.package).execute()

        while results:
            for review in results['reviews']:
                if len(review['comments']) == 1:
                    comment = review['comments'][0]['userComment']
                    kwargs = {
                        'play_store_review_id': review['reviewId'],
                        'android_sdk_version': comment.get('androidOsVersion'),
                        'author_name': review['authorName'],
                        'review_text': comment['text'],
                        'review_rating': comment['starRating'],
                        'last_modified': datetime.fromtimestamp(
                            int(comment['lastModified']['seconds'])
                        )
                    }

                    # TODO: Add application version
                    obj = Review(**kwargs)
                    obj.application = application
                    obj.save()

            if results['tokenPagination']['nextPageToken']:
                nextPageToken = results['tokenPagination']['nextPageToken']
                results = reviews_service.list(
                    packageName=application.package, token=nextPageToken
                ).execute()
            else:
                break

    def handle(self, *args, **kwargs):
        for application in Application.objects.all():
            self.get_reviews(application)
