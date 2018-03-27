from django.db import models

# Create your models here.


class Recipe(models.Model):
    name = models.CharField(max_length=256)
    minutes = models.CharField(max_length=128)
    instructions = models.CharField(max_length=10000)
    ingredients = models.CharField(max_length=2048)
    equipment = models.CharField(max_length=1024)
    skills = models.CharField(max_length=1024)
