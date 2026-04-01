from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer as BaseUserSerializer 
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer

class CustomUserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ('username', 'email', 'last_name', 'first_name')

class CustomUserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ('id', 'username', 'email', 'password', 're_password', 'first_name', 'last_name', 'avatar')