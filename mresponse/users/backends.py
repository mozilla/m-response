from django.contrib.auth.backends import RemoteUserBackend
from .models import User


class Auth0Backend(RemoteUserBackend):
    create_unknown_user = True

    def authenticate(self, request, auth_id):
        if not auth_id:
            return

        user = None

        if self.create_unknown_user:
            user, created = User.objects.get_or_create(
                auth_id=auth_id
            )
            if created:
                user = self.configure_user(user)
                user.save()
        else:
            try:
                user = User.objects.get_by_natural_key(auth_id)
            except User.DoesNotExist:
                pass

        return user

    def configure_user(self, user):
        # TODO: GET {auth0-domain}/userinfo endpoint to get email address
        return user

