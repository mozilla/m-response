import collections
import json
from datetime import timedelta

from django.utils.timezone import now as utc_now

from rest_framework import decorators, permissions, response

from mresponse.responses import models as responses_models
from mresponse.reviews import models as reviews_models


@decorators.api_view(["GET"])
@decorators.permission_classes([permissions.IsAuthenticated])
def homepage(request, format=None):
    return_dict = collections.OrderedDict()

    languages = request.user.profile.languages
    try:
        languages = json.loads(languages)
    except ValueError:
        languages = []

    respond_queue = reviews_models.Review.objects.responder_queue(
        user=request.user
    ).application_is_active()
    three_days_diff = utc_now() - timedelta(days=3)

    if languages:
        respond_queue = respond_queue.languages(languages)

    return_dict["respond_three_days_queue"] = (
        respond_queue.filter(created_on__isnull=False)
        .filter(created_on__gte=three_days_diff)
        .count()
    )

    return_dict["respond_queue"] = respond_queue.count()

    moderation_queue = (
        responses_models.Response.objects.not_authored_by(request.user)
        .not_moderated_by(request.user)
        .application_is_active()
    )

    if languages:
        moderation_queue = moderation_queue.languages(languages)

    if request.user.profile.is_super_moderator:
        moderation_queue = moderation_queue.not_staff_approved()
        moderation_queue = moderation_queue.not_approved()
        moderation_queue = moderation_queue.skip_rejected()
    else:
        moderation_queue = moderation_queue.moderator_queue()
        moderation_queue = moderation_queue.two_or_less_moderations()

    return_dict["moderate_queue"] = moderation_queue.count()
    return response.Response(return_dict)
