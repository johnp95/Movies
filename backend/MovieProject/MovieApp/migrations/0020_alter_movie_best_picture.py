# Generated by Django 4.2.7 on 2023-12-05 21:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0019_alter_movie_female_director'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='best_picture',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
