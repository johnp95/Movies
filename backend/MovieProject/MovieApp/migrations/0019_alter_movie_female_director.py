# Generated by Django 4.2.7 on 2023-12-02 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0018_movie_female_director_movie_language'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='female_director',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
