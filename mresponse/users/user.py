from django.contrib.auth import authenticate


def get_profile(payload):
    auth_id = payload.get('sub').replace('|', '.')
    return authenticate(auth_id=auth_id)