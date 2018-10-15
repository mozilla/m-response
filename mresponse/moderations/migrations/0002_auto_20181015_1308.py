# Generated by Django 2.1.2 on 2018-10-15 12:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('moderations', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moderation',
            name='moderator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='moderations', to=settings.AUTH_USER_MODEL),
        ),
    ]
