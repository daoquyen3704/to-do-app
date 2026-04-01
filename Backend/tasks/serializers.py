from .models import Task, TaskTag, Category
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        read_only_fields = ['user']
        fields = ("id", "name", "color_code")

class TaskSerializer(serializers.ModelSerializer):
    category = CategorySerializer

    class Meta:
        model = Task
        read_only_fields = ['user']
        fields = ("id", "user", "description", "category", "title", "day", "status", "priority", "color")

class TaskDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer

    class Meta:
        model = Task
        read_only_fields = ['user']
        fields = ("id", "description", "category", "title","start_time", "end_time", "day", "status", "priority", "color", "is_all_day")


class TaskCreateSerializer(serializers.ModelSerializer):
    category = CategorySerializer

    class Meta:
        model = Task
        read_only_fields = ['user']
        fields = ("id", "user","description", "start_time", "end_time", "title", "day", "status", "priority", "color")

class TaskTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTag
        fields = ("id", "task", "tag_name")