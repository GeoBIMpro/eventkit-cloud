# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-08-10 15:44
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
import oet2.jobs.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0003_auto_20151027_1807'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExportProvider',
            fields=[
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('uid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('url', oet2.jobs.models.LowerCaseCharField(default='', max_length=10, unique=True)),
            ],
            options={
                'db_table': 'export_provider',
                'managed': True,
            },
        ),
    ]
