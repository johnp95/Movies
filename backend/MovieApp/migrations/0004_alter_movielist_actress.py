# Generated by Django 4.2.7 on 2023-11-16 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MovieApp', '0003_alter_movielist_released'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movielist',
            name='actress',
            field=models.CharField(max_length=30, null=True),
        ),
    ]