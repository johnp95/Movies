# Generated by Django 4.2.7 on 2023-11-21 22:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0011_rename_movies_movie'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='actor',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='actress',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]