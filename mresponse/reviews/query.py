from django.db import models


class ReviewQuerySet(models.QuerySet):
    def unresponded(self):
        """
        Get reviews that have no response.
        """
        return self.filter(response__isnull=True)

    def assigned_to_user(self, user):
        """
        Get reviews that are assigned to a particular user.
        """
        # TODO: Add a logic that only allows to get a review for that user.
        return self
