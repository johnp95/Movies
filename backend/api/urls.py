from django.urls import path
from . import views 
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('movies/', views.MovieList.as_view()),
    path('movies/<int:pk>/', views.MovieDetail.as_view()),
    path('movies/search/', views.MovieSearchView.as_view(), name='movie-search'),
    path('movies/director/', views.DirectorDetailView.as_view(), name='director-detail'),
    path('movies/actor/', views.ActorDetailView.as_view(), name='actor-detail'),
    path('movies/actress/', views.ActressDetailView.as_view(), name='actress-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)