import os
from .base import *  # noqa isort:skip
from .base import WEBPACK_DIR

# Debugging to be enabled locally only
DEBUG = True


# This key to be used locally only.
SECRET_KEY = "CHANGEME!!!"


# Allow all the hosts locally only.
ALLOWED_HOSTS = ["*"]


# Allow requests from the local IPs to see more debug information.
INTERNAL_IPS = ("127.0.0.1", "10.0.2.2")


# Display sent emails in the console while developing locally.
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


# Disable password validators when developing locally.
AUTH_PASSWORD_VALIDATORS = []

# Disable forcing HTTPS locally since development server supports HTTP only.
SECURE_SSL_REDIRECT = False


# Use Django admin instead of OIDC
DJANGO_LOGIN_ENABLED = True


# Don't require yarn build to get new images in dev
STATICFILES_DIRS = [os.path.join(WEBPACK_DIR, "public", "static")]


# Import settings from local.py file if it exists. Please use it to keep
# settings that are not meant to be checked into Git and never check it in.
try:
    from .local import *  # noqa
except ImportError:
    pass
