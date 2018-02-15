# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-02-14 03:58
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0025_auto_20180208_1937'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('jobs', '0023_auto_20171122_1431'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserJobActivity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
            ],
        ),
        migrations.AddField(
            model_name='job',
            name='last_export_run',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='last_export_run', to='tasks.ExportRun'),
        ),
        migrations.AddField(
            model_name='userjobactivity',
            name='job',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='jobs.Job'),
        ),
        migrations.AddField(
            model_name='userjobactivity',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
