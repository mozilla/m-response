from django.urls import path
from django.conf.urls import url
from django.views.generic import TemplateView

urlpatterns = [
    path(
        'service-worker.js',
        TemplateView.as_view(
            template_name='service-worker.js',
            content_type='application/javascript',
        ),
        name='service-worker.js',
    ),
    path(
        'manifest.json',
        TemplateView.as_view(
            template_name='manifest.json',
            content_type='application/json',
        ),
        name='manifest.json',
    ),
    url(r'^', TemplateView.as_view(template_name="index.html"))
]
