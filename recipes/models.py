from django.db import models

# Create your models here.


class Recipe(models.Model):
    name = models.CharField(max_length=256)
    minutes = models.IntegerField()
    instructions = models.CharField(max_length=10000)
    ingredients = models.CharField(max_length=2048)
    equipment = models.CharField(max_length=1024)
    image_url = models.CharField(max_length=512)


class User(models.Model):
    email = models.CharField(max_length=256)
    name = models.CharField(max_length=256)
