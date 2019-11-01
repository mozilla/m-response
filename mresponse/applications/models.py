from django.db import models
from django.utils.translation import ugettext_lazy as _


class Application(models.Model):
    name = models.CharField(max_length=255)
    package = models.CharField(
        max_length=255, help_text=_('E.g. "org.mozilla.firefox".'), unique=True
    )

    def __str__(self):
        return _("%(name)s (%(package)s)") % {
            "name": self.name,
            "package": self.package,
        }


class ApplicationVersion(models.Model):
    application = models.ForeignKey("Application", models.PROTECT, related_name="+")
    name = models.CharField(max_length=255)
    code = models.IntegerField()

    class Meta:
        unique_together = ("application", "code")

    def __str__(self):
        return _("%(app_name)s %(version)s") % {
            "app_name": self.application.name,
            "version": self.name,
        }
