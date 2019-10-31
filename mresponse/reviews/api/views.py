from django.core.cache import cache
from django.utils.translation import ugettext_lazy as _

from rest_framework import exceptions, generics, permissions, response, views

from mresponse.reviews import models as reviews_models
from mresponse.reviews.api import serializers as reviews_serializers
from mresponse.utils import queryset as queryset_utils

MAX_REVIEW_RATING = 2


class Review(generics.RetrieveAPIView):
    """
    Get a review and assign it to user.
    """
    queryset = reviews_models.Review.objects.responder_queue().select_related(
        'application',
        'application_version',
        'response',
    ).filter(review_rating__lte=MAX_REVIEW_RATING)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['show_assignment_expires_at'] = True
        kwargs['show_response_url'] = True
        kwargs['show_skip_url'] = True
        return super().get_serializer(*args, **kwargs)

    def get_languages_list(self):
        try:
            lang_list = self.request.GET['lang'].split(',')
        except KeyError:
            return []
        return [l.strip() for l in lang_list if l.strip()]

    def get_cached_next(self):
        next_key = 'next_review_user_{}'.format(self.request.user.pk)
        next_pk = cache.get(next_key)

        next_qs = reviews_models.Review.objects.filter(
            pk=next_pk, assigned_to__isnull=True
        )

        if next_qs.exists():
            return next_qs.get()
        return None

    def set_cached_next(self, next_review):
        next_key = 'next_review_user_{}'.format(self.request.user.pk)
        if next_review:
            cache.set(next_key, next_review.pk)

    def choose_review_for_user(self):
        """
        Assign or get assigned review for a user to respond on.
        """
        # Get a review that is already assigned for the current user.
        try:
            review = self.get_queryset().assigned_to_user(
                self.request.user
            ).get()
            # Renew assignment
            review.assign_to_user(self.request.user)
            assigned = True
        except reviews_models.Review.DoesNotExist:
            assigned = False

        # Otherwise try to elect a review that is available in the
        # queue and assign it to user.

        base_queryset = self.get_queryset()
        languages_list = self.get_languages_list()
        querysets = []

        # Prioritise English
        if 'en' in languages_list:
            querysets = [
                base_queryset.languages(['en']),
            ]

        # Then prioritise users' languages
        if languages_list:
            querysets.append(base_queryset.languages(languages_list))

        if not assigned:
            cached_review = self.get_cached_next()
            if not cached_review:
                for queryset in querysets:
                    review = queryset_utils.get_random_entry(
                        queryset
                    )
                    if review is not None:
                        break
            else:
                review = cached_review

        next_review = None
        for queryset in querysets:
            next_review = queryset_utils.get_random_entry(
                queryset
            )

            if next_review is not None and next_review.pk != review.pk:
                break

        if review is None:
            raise exceptions.NotFound(
                detail=_('No reviews available in the queue.')
            )
        review.assign_to_user(self.request.user)
        self.set_cached_next(next_review)
        return review

    def get_object(self):
        return self.choose_review_for_user()


class NextReview(generics.RetrieveAPIView):
    """
    Gets the next review in the queue that isn't assigned to a user.
    """
    queryset = reviews_models.Review.objects.unresponded().select_related(
        'application',
        'application_version',
        'response',
    ).filter(review_rating__lte=MAX_REVIEW_RATING)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

    def get_object(self):
        # Check cache first
        next_key = 'next_review_user_{}'.format(self.request.user.pk)
        review_pk = cache.get(next_key)

        if review_pk:
            return reviews_models.Review.objects.get(pk=review_pk)

        raise exceptions.NotFound(
            detail=_('No reviews available in the queue.')
        )


class SkipReview(views.APIView):
    def post(self, *args, format=None, **kwargs):
        try:
            review = reviews_models.Review.objects.assigned_to_user(
                self.request.user
            ).get(pk=kwargs['review_pk'])
        except reviews_models.Review.DoesNotExist:
            raise exceptions.NotFound(
                detail=_('User has no assigned review of this ID.')
            )
        review.return_to_the_queue()
        return response.Response()
