RESPONSE_KARMA_POINTS_AMOUNT = 1
FIRST_MODERATION_KARMA_POINTS_AMOUNT = 1
ONE_MODERATION_KARMA_POINTS_AMOUNT = 2
SECOND_MODERATION_KARMA_POINTS_AMOUNT = 3
APPROVED_RESPONSE_KARMA_POINTS_AMOUNT = 1


def karma_points_for_moderation(response):
    """
    Calculates how many points to award based on how many moderation a responses has.
    """
    mod_count = response.moderation_count()
    if mod_count == 1:
        return ONE_MODERATION_KARMA_POINTS_AMOUNT
    elif mod_count == 2:
        return SECOND_MODERATION_KARMA_POINTS_AMOUNT
    else:
        return FIRST_MODERATION_KARMA_POINTS_AMOUNT
