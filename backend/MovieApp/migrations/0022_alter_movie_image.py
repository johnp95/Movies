# Generated by Django 5.0 on 2023-12-21 22:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0021_movie_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='image',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]