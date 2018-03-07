# Generated by Django 2.0.2 on 2018-03-06 05:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=256)),
                ('name', models.CharField(max_length=256)),
            ],
        ),
        migrations.RenameField(
            model_name='recipe',
            old_name='imageUrl',
            new_name='image_url',
        ),
    ]
