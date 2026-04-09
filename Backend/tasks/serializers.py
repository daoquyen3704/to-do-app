from .models import Task, TaskTag, Category
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        read_only_fields = ['user']
        fields = ("id", "name", "color_code")


class TaskMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        read_only_fields = ['user']
        fields = ("id", "title", "day", "status")
class TaskDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), 
        source='category', 
        write_only=True,
        allow_null=True,
        required=False)
    class Meta:
        model = Task
        read_only_fields = ['user']
        fields = ("id", "description", "category", "category_id", "title", "start_time", "end_time", "day", "status", "priority", "color", "is_all_day")


class TaskDefaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        read_only_fields = ['user']
        fields = ("id", "start_time", "end_time", "status")

class TaskTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTag
        fields = ("id", "task", "tag_name")