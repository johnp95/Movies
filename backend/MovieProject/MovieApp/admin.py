from django.contrib import admin
from .models import Movie

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title','director')
    ordering = ('id',)
    search_fields = ('title','actor','director','actress')
    list_filter = ('date_watched','released')