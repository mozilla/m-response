from django.conf import settings

import requests


def reply_to_review(application, review_id, text):
    """Reply to playstore reviews based on application/review_id"""

    params = {"packageName": application.package, "reviewId": review_id, "text": text}
    headers = {"x-api-key": settings.REVIEWS_API_KEY}
    response = requests.post(settings.REVIEWS_API_URL, params=params, headers=headers)
    response.raise_for_status()

    return response.json()
