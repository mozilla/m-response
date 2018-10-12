import collections

from rest_framework import decorators, permissions, response

from mresponse.reviews import models as reviews_models


@decorators.api_view(['GET'])
@decorators.permission_classes([permissions.IsAuthenticated])
def homepage(request, format=None):
    return_dict = collections.OrderedDict()
    return_dict['respond_queue'] = (
        reviews_models.Review.objects.responder_queue(user=request.user).count()
    )
    # TODO: Replace once moderation is added
    return_dict['moderate_queue'] = 123
    return response.Response(return_dict)
