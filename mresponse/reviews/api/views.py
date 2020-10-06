from django.conf import settings
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

    queryset = (
        reviews_models.Review.objects.application_is_active()
        .select_related("application", "application_version")
        .prefetch_related("responses")
        .filter(review_rating__lte=MAX_REVIEW_RATING)
    )
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["show_assignment_expires_at"] = True
        kwargs["show_response_url"] = True
        kwargs["show_skip_url"] = True
        return super().get_serializer(*args, **kwargs)

    def get_queryset(self):
        return super().get_queryset().responder_queue(user=self.request.user)

    def get_languages_list(self):
        try:
            lang_list = self.request.GET["lang"].split(",")
        except KeyError:
            return []
        return [lang.strip() for lang in lang_list if lang.strip()]

    def get_cached_next(self):
        next_key = "next_review_user_{}".format(self.request.user.pk)
        next_pk = cache.get(next_key)

        next_qs = reviews_models.Review.objects.filter(
            pk=next_pk, assigned_to__isnull=True
        )

        if next_qs.exists():
            return next_qs.get()
        return None

    def set_cached_next(self, next_review):
        next_key = "next_review_user_{}".format(self.request.user.pk)
        if next_review:
            cache.set(next_key, next_review.pk)

    def delete_cached_next(self):
        next_key = "next_review_user_{}".format(self.request.user.pk)
        cache.delete(next_key)

    def get_skipped(self):
        skipped_key = "skipped_reviews_user_{}".format(self.request.user.pk)
        return cache.get(skipped_key, list())

    def choose_review_for_user(self):
        """
        Assign or get assigned review for a user to respond on.
        """
        # Get a review that is already assigned for the current user.
        try:
            review = self.get_queryset().assigned_to_user(self.request.user).get()
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
        if "en" in languages_list:
            querysets = [base_queryset.languages(["en"])]
            languages_list.remove("en")

        # Then prioritise users' languages
        if languages_list:
            querysets.append(base_queryset.languages(languages_list))

        skipped = self.get_skipped()
        if not assigned:
            cached_review = self.get_cached_next()
            if not cached_review or cached_review.assigned_to:
                for queryset in querysets:
                    review = queryset_utils.get_review_entry(queryset, skipped)
                    if review is not None:
                        break
            else:
                review = cached_review

        if review is None:
            raise exceptions.NotFound(detail=_("No reviews available in the queue."))

        next_review = None
        for queryset in querysets:
            next_review = queryset_utils.get_review_entry(
                queryset, skipped + [review.pk]
            )

            if next_review is not None and next_review.pk != review.pk:
                break

        review.assign_to_user(self.request.user)

        # Count available next reviews
        available_next = 0
        for q in querysets:
            available_next += q.count()
        if available_next > 1:
            self.set_cached_next(next_review)
        else:
            self.delete_cached_next()
        return review

    def get_object(self):
        return self.choose_review_for_user()


class NextReview(generics.RetrieveAPIView):
    """
    Gets the next review in the queue that isn't assigned to a user.
    """

    queryset = (
        reviews_models.Review.objects.unresponded()
        .select_related("application", "application_version")
        .prefetch_related("responses")
        .filter(review_rating__lte=MAX_REVIEW_RATING)
    )
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = reviews_serializers.ReviewSerializer

    def get_object(self):
        # Check cache first
        next_key = "next_review_user_{}".format(self.request.user.pk)
        review_pk = cache.get(next_key)

        if review_pk:
            return reviews_models.Review.objects.get(pk=review_pk)

        raise exceptions.NotFound(detail=_("No reviews available in the queue."))


class SkipReview(views.APIView):
    def post(self, *args, format=None, **kwargs):
        try:
            review_pk = kwargs["review_pk"]

            review = reviews_models.Review.objects.assigned_to_user(
                self.request.user
            ).get(pk=review_pk)

            skipped_key = "skipped_reviews_user_{}".format(self.request.user.pk)
            skipped = cache.get(skipped_key, list())
            cache.set(
                skipped_key,
                skipped + [review_pk],
                timeout=settings.SKIPPED_CACHE_TIMEOUT,
            )

        except reviews_models.Review.DoesNotExist:
            raise exceptions.NotFound(
                detail=_("User has no assigned review of this ID.")
            )
        review.return_to_the_queue()
        return response.Response()
