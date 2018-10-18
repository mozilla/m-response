import collections

from rest_framework import decorators, permissions, response

from mresponse.responses import models as responses_models
from mresponse.reviews import models as reviews_models


@decorators.api_view(['GET'])
@decorators.permission_classes([permissions.IsAuthenticated])
def homepage(request, format=None):
    return_dict = collections.OrderedDict()
    return_dict['respond_queue'] = (
        reviews_models.Review.objects.responder_queue(user=request.user).count()
    )
    return_dict['moderate_queue'] = (
        responses_models.Response.objects
                                 .not_authored_by(request.user)
                                 .not_moderated_by(request.user)
                                 .moderator_queue()
                                 .count()
    )
    return response.Response(return_dict)
