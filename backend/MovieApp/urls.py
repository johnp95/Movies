from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
# router = DefaultRouter()
# router.register('add_movie', views.MovieViewset,basename='add_movie')
# urlpatterns = router.urls

urlpatterns = [

    path('',views.home,name='home'),
    path('add_movie/', views.add_movie, name='add-movie'),
    path('movie_list/',views.movie_list,name='movie-list'),
    path('movie_detail/<int:pk>/',views.movie_detail,name='movie-detail'),
    path('search_movie/',views.search_movie,name='search-movie'),
    path('oldest_movies/',views.oldest_movies,name='oldest-movies'),
    path('recent_movies/',views.recent_movies,name='recent-movies'),
    path('director_detail/<str:director>/',views.director_detail,name='director-detail'),
    path('actor_detail/<str:actor>/',views.actor_detail,name='actor-detail'),
    path('actress_detail/<str:actor>/',views.actress_detail,name='actress-detail'),
    path('decades/<int:year>/',views.decades,name='decades'),
    path('released/<int:year>/',views.released,name='released'),
    path('female_directed/',views.female_directed,name='female-directed'),
    path('languages/<str:language>/',views.languages,name='languages'),
    path('most_watched/',views.most_watched,name='most-watched'),
    path('delete_movie/<int:pk>',views.delete_movie,name='delete-movie'),
    path('update_movie/<int:pk>', views.update_movie,name='update-movie'),

]
