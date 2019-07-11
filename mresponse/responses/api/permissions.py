from rest_framework import permissions


class BypassStaffOrCommunityModerationPermission(permissions.BasePermission):
    message = 'No permission to bypass community or staff moderation.'

    def has_permission(self, request, view):
        return (
            request.user.has_perm('responses.can_bypass_staff_moderation')
            or request.user.has_perm('responses.can_bypass_community_moderation')
        )
