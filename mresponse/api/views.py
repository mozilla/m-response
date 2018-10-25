import collections

import pycountry
from rest_framework import decorators, permissions, response, reverse, views


@decorators.api_view(['GET'])
@decorators.permission_classes([permissions.AllowAny])
def api_root(request, format=None):
    response_dict = collections.OrderedDict()
    if request.user.is_authenticated:
        response_dict['me'] = reverse.reverse(
            'my_user',
            request=request,
            format=format,
        )
        response_dict['homepage'] = reverse.reverse(
            'homepage',
            request=request,
            format=format,
        )
        response_dict['review'] = reverse.reverse(
            'get_review', request=request, format=format)
        response_dict['response'] = reverse.reverse(
            'get_response', request=request, format=format)
    response_dict['config'] = reverse.reverse(
        'config', request=request, format=format)
    return response.Response(response_dict)


class Config(views.APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        response_dict = collections.OrderedDict()
        response_dict['languages'] = self.get_languages()
        response_dict['response_guide_book_url'] = (
            'https://docs.google.com/document/d/1dtTS0hAIYyf9JWoqPc_S2tg2XmdptVYI06koGCZwiXc/'
        )
        response_dict['feedback_url'] = (
            'https://github.com/torchbox/m-response/issues/new')
        response_dict['about_url'] = 'https://www.mozilla.org/en-US/about/'
        response_dict['legal_url'] = 'https://www.mozilla.org/about/legal/'
        response_dict['privacy_url'] = 'https://www.mozilla.org/privacy/'
        response_dict[
            'cookies_url'] = 'https://www.mozilla.org/privacy/websites/#cookies'
        return response.Response(response_dict)

    def get_languages(self):
        languages = [
            pycountry.languages.get(alpha_2=lang) for lang in [
                'af',
                'ar',
                'az',
                'bn',
                'bg',
                'my',
                'ca',
                'zh',
                'hr',
                'cs',
                'da',
                'nl',
                'en',
                'et',
                'fi',
                'fr',
                'ka',
                'de',
                'el',
                'he',
                'hi',
                'hu',
                'is',
                'id',
                'it',
                'ja',
                'km',
                'ko',
                'lo',
                'lv',
                'lt',
                'mk',
                'ms',
                'ml',
                'mr',
                'no',
                'fa',
                'pl',
                'pt',
                'ro',
                'ru',
                'sr',
                'sk',
                'sl',
                'es',
                'sv',
                'tl',
                'te',
                'th',
                'tr',
                'uk',
                'vi',
            ]
        ]
        for language in languages:
            yield collections.OrderedDict([
                ('id', getattr(language, 'alpha_2', language.alpha_3)),
                ('display_name', language.name),
            ])
