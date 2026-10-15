from MovieApp.models import Movie
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MovieSerializer


class MovieList(generics.ListCreateAPIView):
    queryset = Movie.objects.all().order_by("-date_watched")
    serializer_class = MovieSerializer


class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all().order_by("id")
    serializer_class = MovieSerializer


class MovieSearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.GET.get("query", "")
        results = (
            Movie.objects.filter(title__icontains=query)
            .order_by("title")
            .distinct("title")
            | Movie.objects.filter(director__icontains=query)
            .order_by("title")
            .distinct("title")
            | Movie.objects.filter(actor__icontains=query)
            .order_by("title")
            .distinct("title")
            | Movie.objects.filter(actress__icontains=query)
            .order_by("title")
            .distinct("title")
        )

        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)


class DirectorDetailView(APIView):
    def get(self, request, *args, **kwargs):
        director = request.GET.get("director", "")
        results = Movie.objects.filter(director=director).distinct("title")

        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)


class ActorDetailView(APIView):
    def get(self, request, *args, **kwargs):
        actor = request.GET.get("actor", "")
        results = Movie.objects.filter(actor=actor).distinct("title")
        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)


class ActressDetailView(APIView):
    def get(self, request, *args, **kwargs):
        actress = request.GET.get("actress", "")
        results = Movie.objects.filter(actress=actress).distinct("title")
        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)
