from django.contrib.postgres.fields import ArrayField
from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=100)
    director = models.CharField(max_length=100)
    actors = ArrayField(models.CharField(max_length=50), default=list, blank=True)
    actresses = ArrayField(models.CharField(max_length=50), default=list, blank=True)
    date_watched = models.DateField()
    released = models.IntegerField()
    language = models.CharField(max_length=50, null=True, blank=True)
    best_picture = models.BooleanField(null=True, blank=True, default=False)
    female_director = models.BooleanField(null=True, blank=True, default=False)
    image = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        db_table = "movies"

    def __str__(self):
        return self.title
