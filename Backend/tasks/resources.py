from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from .models import Task, Category
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()

class TaskResource(resources.ModelResource):
    category = fields.Field(
        column_name='category_id',
        attribute='category',
        widget=ForeignKeyWidget(Category, 'pk')
    )
    user = fields.Field(
        column_name='user_id',
        attribute='user',
        widget=ForeignKeyWidget(User, 'pk')
    )
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'start_time', 'end_time', 
            'status', 'priority', 'category', 'user', 'color', 'is_all_day', 'day')
        import_id_fields = ('title','day') 
        skip_unchanged = True

    def before_import_row(self, row, **kwargs):
        user = kwargs.get('user')
        if user:
            row['user_id'] = user.id

        if row.get('category_id') == 'NULL' or row.get('category_id') == '':
            row['category_id'] = None
        
        if 'id' in row and row['id'] == '':
            del row['id']
    