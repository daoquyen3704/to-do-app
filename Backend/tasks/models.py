from django.utils import timezone

from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.
class Category(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    color_code = models.CharField(max_length=7, null=True, blank=True)

    def __str__(self):
        return self.name
    
class Task(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='tasks')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField(auto_now_add=True, null=True, blank=True) 
    end_time = models.DateTimeField(null=True, blank=True)  
    day = models.DateField(default=timezone.now)
    status = models.CharField(max_length=50, default='Pending')
    priority = models.CharField(max_length=50, default='Medium')
    is_all_day = models.BooleanField(default=False)
    color = models.TextField(null=True, blank=True)
    
    
class TaskTag(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='tags')  # Quan hệ với Task
    tag_name = models.CharField(max_length=100)

    def __str__(self):
        return self.tag_name