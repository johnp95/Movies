# Generated by Django 4.2.7 on 2023-11-29 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0015_movie_fun_fact_alter_movie_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='best_picture',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
