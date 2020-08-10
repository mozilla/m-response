from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Prefetch
from django.utils.timezone import now

from mresponse.reviews.models import Review
from mresponse.reviews.api.views import MAX_REVIEW_RATING
from mresponse.responses.models import Response

User = get_user_model()


class Command(BaseCommand):
    def responded_reviews(self, language="", period=timedelta(), since=None):
        reviews = Review.objects.filter(
            review_rating__lte=MAX_REVIEW_RATING,
            application__is_archived=False,
            last_modified__lte=now() - period,
        ).prefetch_related(
            Prefetch(
                "responses",
                queryset=Response.objects.filter(
                    submitted_to_play_store_at__isnull=False
                ),
            )
        )
        if language:
            reviews = reviews.filter(review_language=language)
        if since:
            reviews = reviews.filter(last_modified__gte=since)

        review_count = 0
        responded_in_period_count = 0

        for review in reviews:
            review_count += 1
            response = review.responses.first()
            if (
                response
                and response.submitted_to_play_store_at - review.last_modified <= period
            ):
                responded_in_period_count += 1

        return responded_in_period_count / review_count if review_count else 0

    def active_contributors(
        self, required_responses=0, required_moderations=0, period=timedelta(),
    ):
        since = now() - period
        return (
            User.objects.annotate(
                responses_count=Count(
                    "responses", filter=Q(responses__submitted_at__gte=since)
                ),
                moderations_count=Count(
                    "moderations", filter=Q(moderations__submitted_at__gte=since)
                ),
            )
            .filter(
                responses_count__gte=required_responses,
                moderations_count__gte=required_moderations,
            )
            .count()
        )

    def add_arguments(self, parser):
        parser.add_argument(
            "--post-report", help="Post this report", action="store_true"
        )
        parser.add_argument(
            "--responded-hours",
            help="Hours reviews should be responded to within",
            type=int,
            default=72,
        )
        parser.add_argument(
            "--responded-languages",
            help="Languages to report on",
            action="append",
            default=["en", "de", "es"],
        )
        parser.add_argument(
            "--contribute-days",
            help="Days to report active contributors for",
            type=int,
            default=7,
        )
        parser.add_argument(
            "--contribute-responses",
            help="Responses needed to be deemed active",
            type=int,
            default=5,
        )
        parser.add_argument(
            "--contribute-moderations",
            help="Moderations needed to be deemed active",
            type=int,
            default=15,
        )

    def generate_report(self, options):
        report = "Report generated at {}:\n".format(now())
        for language in options["responded_languages"]:
            report += "Responses in {} responded to within {} hours: {:.1%}\n".format(
                language,
                options["responded_hours"],
                self.responded_reviews(
                    language=language,
                    period=timedelta(hours=options["responded_hours"]),
                ),
            )
        report += "Active contributors (at least {} responses and {} moderations) in the past {} days: {}\n".format(
            options["contribute_responses"],
            options["contribute_moderations"],
            options["contribute_days"],
            self.active_contributors(
                required_responses=options["contribute_responses"],
                required_moderations=options["contribute_moderations"],
                period=timedelta(days=options["contribute_days"]),
            ),
        )
        return report

    def post_report(self, report):
        raise NotImplementedError

    def handle(self, *args, **kwargs):
        report = self.generate_report(kwargs)
        if kwargs["post_report"]:
            self.post_report(report)
        else:
            print(report)
