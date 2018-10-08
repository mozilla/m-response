# Generated by Django 2.1.2 on 2018-10-08 13:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('package', models.CharField(help_text='E.g. "org.mozilla.firefox".', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='ApplicationVersion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('code', models.IntegerField()),
                ('application', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='applications.Application')),
            ],
        ),
    ]
