# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-17 17:55
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0012_auto_20170413_0124'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exportconfig',
            name='user',
        ),
        migrations.RemoveField(
            model_name='job',
            name='configs',
        ),
        migrations.AddField(
            model_name='job',
            name='preset',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='jobs.DatamodelPreset'),
        ),
        migrations.AlterField(
            model_name='datamodelpreset',
            name='json_tags',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='exportprovider',
            name='config',
            field=models.TextField(blank=True, default='', help_text='This is an optional field to put in additional configuration.', null=True, verbose_name='Configuration'),
        ),
        migrations.DeleteModel(
            name='ExportConfig',
        ),
    ]