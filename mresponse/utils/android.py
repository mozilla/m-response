from django.utils.translation import ugettext_lazy as _

ANDROID_VERSIONS = {
    28: (9,),
    27: (8, 1, 0),
    26: (8,),
    25: (7, 1),
    24: (7,),
    23: (6,),
    22: (5, 1),
    21: (5,),
    19: (4, 4),
    18: (4, 3),
    17: (4, 2),
    16: (4, 1),
    15: (4, 0, 3),
    14: (4, 0, 1),
    13: (3, 2),
    12: (3, 1),
    11: (3,),
    10: (2, 3, 3),
    9: (2, 3),
    8: (2, 2),
    7: (2, 1),
    6: (2, 0, 1),
    5: (2,),
    4: (1, 6),
    3: (1, 5),
    2: (1, 1),
    1: (1,),
}


def get_android_version(android_sdk_number):
    return ANDROID_VERSIONS.get(android_sdk_number)


def get_human_readable_android_version(android_sdk_number):
    version = get_android_version(android_sdk_number)
    if version is None:
        return _('Unknown')
    return '.'.join(str(v) for v in version)
