import os

from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from PIL import Image as PILImage
from rest_framework import permissions, response, views

from mresponse.images.models import Image

ALLOWED_EXTENSIONS = ['gif', 'jpg', 'jpeg', 'png']


class ImageFormatError(Exception):
    pass


def check_image_file_format(f):
    """
    Checks that an image's internal format matches the extension
    """
    # Check file extension
    extension = os.path.splitext(f.name)[1].lower()[1:]

    if extension not in ALLOWED_EXTENSIONS:
        raise ImageFormatError(_('Not a supported image format.'))

    if hasattr(f, 'image'):
        # Django 1.8 annotates the file object with the PIL image
        image = f.image
    elif not f.closed:
        # Open image file
        file_position = f.tell()
        f.seek(0)

        try:
            image = PILImage.open(f)
        except IOError:
            # Uploaded file is not even an image file (or corrupted)
            raise ImageFormatError(_('Not a valid image.'))

        f.seek(file_position)
    else:
        # Couldn't get the PIL image, skip checking the internal file format
        return

    image_format = extension.upper()
    if image_format == 'JPG':
        image_format = 'JPEG'

    internal_image_format = image.format.upper()
    if internal_image_format == 'MPO':
        internal_image_format = 'JPEG'

    # Check that the internal format matches the extension
    # It is possible to upload PSD files if their extension is set to jpg, png or gif. This should catch them out
    if internal_image_format != image_format:
        raise ImageFormatError(_('Not a valid {} image.').format(image_format))


class Upload(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, serializer):
        if 'image' not in self.request.FILES:
            return response.Response({
                'error': _('No file uploaded')
            }, status=400)

        # Check image format
        try:
            check_image_file_format(self.request.FILES['image'])
        except ImageFormatError as e:
            return response.Response({
                'error': str(e)
            }, status=400)

        image = Image.objects.create(
            file=self.request.FILES['image'],
            uploaded_by=self.request.user,
            uploaded_at=timezone.now(),
        )

        profile = self.request.user.profile
        profile.avatar = image.file.url
        profile.save()

        return response.Response({
            'id': image.id,
            'src': image.file.url,
        }, status=201)
