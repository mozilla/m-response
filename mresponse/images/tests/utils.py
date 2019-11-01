from io import BytesIO

from django.core.files.images import ImageFile

import PIL.Image


def get_test_image_file(filename="test.png", colour="white", size=(640, 480)):
    f = BytesIO()
    image = PIL.Image.new("RGBA", size, colour)
    image.save(f, "PNG")
    return ImageFile(f, name=filename)


def get_test_image_file_jpeg(filename="test.jpg", colour="white", size=(640, 480)):
    f = BytesIO()
    image = PIL.Image.new("RGB", size, colour)
    image.save(f, "JPEG")
    return ImageFile(f, name=filename)
