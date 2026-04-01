from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer, TaskCreateSerializer
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
import tablib
from .resources import TaskResource

class TaskViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.method == "POST":
            return TaskCreateSerializer
        return TaskSerializer
    
    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user).order_by("priority")
        date = self.request.query_params.get('date', None)
        category_id = self.request.query_params.get('category_id', None)
        status = self.request.query_params.get('status', None)
        if date:
            queryset = queryset.filter(start_time__date=date)
        elif category_id:
            queryset = queryset.filter(category_id=category_id)
        elif status:
            queryset = queryset.filter(status=status)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    @action(detail=False, methods=['get'], url_path='export-tasks')
    def export_template(self, request):
        try:
            headers = ['title', 'description', 'start_time', 'end_time', 'status', 'priority', 'category_id', 'color', 'is_all_day', 'day']
            dataset = tablib.Dataset(headers=headers)
            dataset.append(['Task mẫu 1', 'Mô tả chi tiết công việc', '2026-01-01 09:00:00', '2026-01-01 10:00:00', 'Pending', 'Low', '', '#3182ce', 'False', '2026-01-01'])
            dataset.append(['Task mẫu 2', 'Mô tả chi tiết công việc', '2026-01-01 09:00:00', '2026-01-01 10:00:00', 'In Progress', 'High', '', "#f52c08", 'False', '2026-01-01'])
            dataset.append(['Task mẫu 3', 'Mô tả chi tiết công việc', '2026-01-01 09:00:00', '2026-01-01 10:00:00', 'Completed', 'Medium', '', "#c4f809", 'False', '2026-01-01'])
            
            response = HttpResponse(
            dataset.xlsx, 
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="task_template.xlsx"'
            
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['post'], url_path='import-tasks')
    def import_tasks(self, request):
        parser_classes = [MultiPartParser]
        file = request.FILES.get('file')
        if not file:
            return Response({"error":"Please select a file"}, status=400)
        
        extension = file.name.split('.')[-1].lower()
        dataset = tablib.Dataset()
        if extension == 'csv':
            file_data = file.read().decode('utf-8-sig')
            dataset.load(file_data, format='csv')
        elif extension in ['xls', 'xlsx']:
            file_data = file.read()
            dataset.load(file_data, format='xlsx')
        else:
            return Response({"error":"Data file contains errors."}, status=400)
        resource = TaskResource()
    
        result = resource.import_data(dataset, dry_run=True, user=request.user)
            
        if result.has_errors():
            errors_list = []
            return Response({
                "error": "Data file contains errors.", 
                "details": errors_list 
            }, status=400)
        resource.import_data(dataset, dry_run=False,user = request.user)
        return Response({"message": f"Import successfully {len(dataset)} task."}, status=201)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)


