from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(blank=True, null=True, upload_to='profile_img/')
    email = models.EmailField(unique=True)
    def __str__(self):
        return self.username
    