import collections

import pycountry
from rest_framework import decorators, permissions, response, reverse, views


@decorators.api_view(['GET'])
@decorators.permission_classes([permissions.AllowAny])
def api_root(request, format=None):
    response_dict = collections.OrderedDict()
    response_dict['config'] = reverse.reverse(
        'config',
        request=request,
        format=format
    )
    return response.Response(response_dict)


class Config(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        response_dict = collections.OrderedDict()
        response_dict['languages'] = self.get_languages()
        return response.Response(response_dict)

    def get_languages(self):
        languages = [
            pycountry.languages.get(alpha_2='de'),
            pycountry.languages.get(alpha_2='en'),
            pycountry.languages.get(alpha_2='fr'),
        ]
        for language in languages:
            yield collections.OrderedDict([
                ('id', getattr(language, 'alpha_2', language.alpha_3)),
                ('display_name', language.name),
            ])
