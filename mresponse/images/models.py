import os

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from unidecode import unidecode


def get_upload_to(instance, filename):
    folder_name = 'uploaded_images'
    filename = instance.file.field.storage.get_valid_name(filename)

    # do a unidecode in the filename and then
    # replace non-ascii characters in filename with _ , to sidestep issues with filesystem encoding
    filename = "".join((i if ord(i) < 128 else '_') for i in unidecode(filename))

    # Truncate filename so it fits in the 100 character limit
    # https://code.djangoproject.com/ticket/9893
    full_path = os.path.join(folder_name, filename)
    if len(full_path) >= 95:
        chars_to_trim = len(full_path) - 94
        prefix, extension = os.path.splitext(filename)
        filename = prefix[:-chars_to_trim] + extension
        full_path = os.path.join(folder_name, filename)

    return full_path


class Image(models.Model):
    file = models.ImageField(
        verbose_name=_('file'), upload_to=get_upload_to, width_field='width', height_field='height'
    )
    width = models.IntegerField(verbose_name=_('width'), editable=False)
    height = models.IntegerField(verbose_name=_('height'), editable=False)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.PROTECT,
        related_name='uploaded_images'
    )
    uploaded_at = models.DateTimeField(default=timezone.now, editable=False)
