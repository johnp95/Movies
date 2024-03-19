from django.db import models
from datetime import date

class Movie(models.Model):
    title = models.CharField(max_length=100)
    director = models.CharField(max_length=100)
    actor = models.CharField(max_length=50,null=True,blank=True)
    actress = models.CharField(max_length=50,null=True,blank=True)
    date_watched = models.DateField()
    released = models.IntegerField()
    language = models.CharField(max_length=50,null=True,blank=True)
    movie_images = models.ImageField(null=True,blank=True,upload_to="images/")
    best_picture = models.BooleanField(null=True,blank=True,default=False)
    female_director = models.BooleanField(null=True,blank=True,default=False)
    image = models.CharField(max_length=200, null=True,blank=True)
    
    def __str__(self):
        return self.title
    
    @property
    def Days_since(self):
        today = date.today()
        difference = today - self.date_watched

        years = difference.days // 365
        remaining_days = difference.days % 365
        
        return f"{years} years, {remaining_days} days" if years > 0 else f"{remaining_days} days"
    