from django.conf import settings

from mozapkpublisher.common.googleplay import _connect


def reply_to_review(application, review_id, text):
    """Reply to playstore reviews based on application/review_id"""

    service = _connect(settings.PLAY_ACCOUNT, settings.PLAY_CREDENTIALS_PATH)
    service = service.reviews()
    reply = service.reply(
        packageName=application.package,
        reviewId=review_id,
        body={"replyText": text}
    ).execute()

    return reply
