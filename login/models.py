from django.db import models

# Create your models here.

class User(models.Model):
    email = models.CharField(max_length=256)
    name = models.CharField(max_length=256)
    recipes_completed = models.CharField(max_length=1024)
    skills_learned = models.CharField(max_length=1024)
