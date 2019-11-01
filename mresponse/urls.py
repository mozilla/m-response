from django.conf import settings
from django.contrib import admin
from django.contrib.auth.views import LoginView
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("mresponse.api.urls")),
    path(
        "contribute.json",
        TemplateView.as_view(
            template_name="contribute.json", content_type="application/json"
        ),
        name="contribute.json",
    ),
]

if settings.DJANGO_LOGIN_ENABLED:
    urlpatterns += [path("oidc/authenticate/", LoginView.as_view())]
else:
    urlpatterns += [path("oidc/", include("mozilla_django_oidc.urls"))]

if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [path("", include("mresponse.frontend.urls"))]
