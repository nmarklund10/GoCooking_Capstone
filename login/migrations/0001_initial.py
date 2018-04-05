# Generated by Django 2.0.2 on 2018-03-28 04:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=256)),
                ('name', models.CharField(max_length=256)),
                ('recipes_completed', models.CharField(max_length=1024)),
                ('skills_learned', models.CharField(max_length=1024)),
            ],
        ),
    ]
