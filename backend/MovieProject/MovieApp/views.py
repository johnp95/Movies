# python manage.py sqlsequencereset MovieApp | python manage.py dbshell
from django.shortcuts import render,get_object_or_404,redirect
from django.urls import reverse
from .models import Movie
from .forms import MovieForm
from django.core.paginator import Paginator
from django.contrib import messages
from django.db.models import Count,Q
from rest_framework import viewsets,permissions
from rest_framework.response import Response
from .serializers import MovieSerializer

def update_movie(request, pk):
    movie = Movie.objects.get(pk=pk)
    form = MovieForm(request.POST or None,request.FILES or None, instance=movie)
    
    if form.is_valid():
        form.save()
        messages.success(request, f"You successfully updated {movie}")
        
        # Get the URL for the movie-detail view with the updated movie's pk
        movie_detail_url = reverse('movie-detail', kwargs={'pk': movie.pk})
        
        return redirect(movie_detail_url)

    context = {
        'movie': movie,
        'form': form,
    }

    return render(request, 'MovieApp/update_movie.html', context)

def delete_movie(request,pk):
    movie = Movie.objects.get(pk=pk)
    movie.delete()
    messages.warning(request,f"You Deleted {movie}")
    return redirect('movie-list')

def most_watched(request):

    title_counts = Movie.objects.values('title').annotate(title_count=Count('title'))
    most_watched_films = title_counts.order_by('-title_count')[:5]
    context = {
       'most_watched_films': most_watched_films
    }
    return render(request,'MovieApp/most_watched.html',context)

def languages(request,language):
    language_films = Movie.objects.filter(language=language).distinct('title')
    context = {
        'language_films': language_films,
        'language': language,
    }
    return render(request,'MovieApp/languages.html',context)


def female_directed(request):

    female_directed_films = Movie.objects.filter(female_director=True)
    context = {
        'female_directed_films': female_directed_films
        
    }

    return render(request,'MovieApp/female_directed.html',context)

def released(request,year):
    released_films = Movie.objects.filter(released=year)

    context = {
        'released_films': released_films,
        'year': year,
    }

    return render(request,'MovieApp/released.html',context)

def actor_detail(request,actor):

    actor_films = Movie.objects.filter(actor=actor).distinct('title')
    actor_films_count = Movie.objects.filter(actor=actor).distinct('title').count()

    context = {
        'actor_films': actor_films,
        'actor': actor,
        'actor_films_count': actor_films_count,
    }

    return render(request,'MovieApp/actor_detail.html', context)

def actress_detail(request,actor):

    actress_films = Movie.objects.filter(actress=actor).distinct('title')
    actress_films_count = Movie.objects.filter(actress=actor).distinct('title').count()

    context = {
        'actress_films': actress_films,
        'actor': actor,
        'actress_films_count': actress_films_count,
    }

    return render(request,'MovieApp/actress_detail.html', context)

def director_detail(request,director):

    directed_films = Movie.objects.filter(director=director).distinct('title')
    directed_films_count = Movie.objects.filter(director=director).distinct('title').count()

    context = {
        'directed_films': directed_films,
        'director': director,
        'directed_films_count': directed_films_count,
    }
    return render(request,'MovieApp/director_detail.html',context)

def recent_movies(request):

    p = Paginator(Movie.objects.all().order_by('-date_watched'),6)
    page = request.GET.get('page')
    movies = p.get_page(page)

    context = {
        'movies': movies
    }

    return render(request,'MovieApp/recent_movies.html',context)

def oldest_movies(request):

    p = Paginator(Movie.objects.all().order_by('released'),6)
    page = request.GET.get('page')
    movies = p.get_page(page)
    context = {
        'movies': movies
    }

    return render(request,'MovieApp/oldest_movies.html',context)

def add_movie(request):

    form = MovieForm(request.POST or None)
    movies = Movie.objects.all()
    if form.is_valid():
        form.save()
        form = MovieForm()
    context = {
        'form': form,
        'movies': movies
    }

    return render(request,'MovieApp/add_movie.html',context)

def movie_list(request):

    
    p = Paginator(Movie.objects.all().order_by('id'),6)
    page = request.GET.get('page')
    movies = p.get_page(page)
    context = {
        'movies': movies
    }

    return render(request,'MovieApp/movie_list.html',context)

def movie_detail(request,pk):
    
    movie = get_object_or_404(Movie,pk=pk)
    movie_count = Movie.objects.filter(title=movie).count()
    title_counts = Movie.objects.values('title').annotate(title_count=Count('title'))
    sorted_title_counts = title_counts.order_by('-title_count')
    most_frequent_title = sorted_title_counts.first()
    
    context = {
        'movie':movie,
        'movie_count': movie_count,
        }
    
    if str(movie) == most_frequent_title['title']:
        messages.success(request,'THIS IS THE MOST WATCHED')
        return render(request,'MovieApp/movie_detail.html',context)
    
    return render(request,'MovieApp/movie_detail.html',context)


def search_movie(request):

    if request.method == 'POST':
        searched = request.POST['search_data']
        movies = Movie.objects.filter(
            Q(title__icontains=searched) | Q(director__icontains=searched)
            ).order_by('title','-date_watched')

        context = {
            'searched': searched,
            'movies': movies,
        }
        return render(request,'MovieApp/search_movie.html',context)
    else:
        return render(request,'MovieApp/search_movie.html',{})

def decades(request,year):
    decade_films = Movie.objects.filter(released__gte=year,released__lte=year+9).distinct('title')
    decade_films_count = Movie.objects.filter(released__gte=year,released__lte=year+9).distinct('title').count()
    context = {
        'decade_films': decade_films,
        'decade_films_count': decade_films_count,
        'year': year,
    }

    return render(request,'MovieApp/decades.html',context)

def home(request):
    return render(request,'MovieApp/home.html')