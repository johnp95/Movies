from django.urls import path
from . import views 
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('movies/', views.MovieList.as_view()),
    path('movies/<int:pk>/', views.MovieDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)