from django.conf import settings

from mozapkpublisher.common.googleplay import connect


def reply_to_review(application, review_id, text):
    """Reply to playstore reviews based on application/review_id"""

    body = {"replyText": text}
    service = connect(settings.PLAY_ACCOUNT, settings.PLAY_CREDENTIALS_PATH)
    service = service.reviews()
    reply = service.reply(
        packageName=application.name,
        reviewId=review_id,
        body=body
    ).execute()

    return reply
