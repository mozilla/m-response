from django.conf import settings
from django.core.exceptions import PermissionDenied

from mozilla_django_oidc.auth import OIDCAuthenticationBackend


class MFAAuthenticationBackend(OIDCAuthenticationBackend):
    """Add 2fa information in user session"""

    def filter_users_by_claims(self, claims):
        users = super(MFAAuthenticationBackend, self).filter_users_by_claims(claims)
        if users.exists():
            self.request.session['oidc_claims_sub'] = claims['sub']
        return users


def admin_mfa_middleware(get_response):
    """Force MFA in admin views"""

    def middleware(request):
        """Check OIDC sub and allow only LDAP"""
        if request.path.startswith('/admin/') and not settings.DEBUG:
            oidc_sub = request.session.get('oidc_claims_sub', '')
            is_admin_mfa = 'ad|Mozilla-LDAP' in oidc_sub
            if not is_admin_mfa:
                raise PermissionDenied

        response = get_response(request)
        return response

    return middleware
