# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import movie_list, MovieViewSet

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

urlpatterns = [
    path('movies/', movie_list, name='movie-list'),
    path('', include(router.urls)),
]
