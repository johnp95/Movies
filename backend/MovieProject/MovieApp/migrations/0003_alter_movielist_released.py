# Generated by Django 4.2.7 on 2023-11-07 00:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0002_rename_leading_actor_movielist_actor_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movielist',
            name='released',
            field=models.CharField(max_length=4),
        ),
    ]
