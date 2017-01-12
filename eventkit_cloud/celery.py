from __future__ import absolute_import

import os

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventkit_cloud.settings.prod')

from django.conf import settings  # noqa

app = Celery('eventkit_cloud', strict_typing=False)
app.conf.task_protocol = 1

app.config_from_object('django.conf:settings')
app.autodiscover_tasks()
