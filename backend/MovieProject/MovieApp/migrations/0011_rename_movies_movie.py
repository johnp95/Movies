# Generated by Django 4.2.7 on 2023-11-21 21:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0010_rename_movielist_movies'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Movies',
            new_name='Movie',
        ),
    ]
