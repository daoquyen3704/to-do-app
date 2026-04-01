from celery import shared_task
import time

@shared_task
def export_tasks_to_csv(user_id):
    from .models import Task
    from .resources import TaskResource
    from django.core.files.storage import default_storage

    queryset = Task.objects.filter(user_id=user_id)
    resource = TaskResource()
    dataset = resource.export(queryset)
    return dataset.csv