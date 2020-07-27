def user_can_bypass_staff_approval_for_review(user, review):
    if user.is_superuser:
        return True
    if not user.profile.is_super_moderator:
        return False
    permissions_in_locales = user.profile.permissions_in_locales
    return review.review_language in permissions_in_locales
