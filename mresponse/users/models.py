from django.contrib.auth.models import AbstractBaseUser, UserManager
from django.db import models


class Auth0UserManager(UserManager):

    def get_by_natural_key(self, username):
        try:
            return self.get(auth_id=username)
        except User.DoesNotExist:
            return None


class User(AbstractBaseUser):
    objects = Auth0UserManager()

    auth_id = models.CharField(unique=True, max_length=255)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    # languages_spoken = ArrayField(models.CharField(max_length=2, unique=True))

    USERNAME_FIELD = 'auth_id'