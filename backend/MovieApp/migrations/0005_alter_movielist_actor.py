# Generated by Django 4.2.7 on 2023-11-16 22:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0004_alter_movielist_actress'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movielist',
            name='actor',
            field=models.CharField(max_length=30, null=True),
        ),
    ]