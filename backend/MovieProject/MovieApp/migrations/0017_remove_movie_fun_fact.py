# Generated by Django 4.2.7 on 2023-11-29 18:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0016_movie_best_picture'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='fun_fact',
        ),
    ]
