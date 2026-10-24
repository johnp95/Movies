from django.db.models import Q
from MovieApp.models import Movie
from rest_framework import generics
from rest_framework.permissions import AllowAny
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
        # A rewatched movie has one row per viewing; keep the first viewing
        # so DISTINCT ON picks a predictable row instead of an arbitrary one.
        results = (
            Movie.objects.filter(
                Q(title__icontains=query)
                | Q(director__icontains=query)
                | Q(actors__icontains=query)
                | Q(actresses__icontains=query)
            )
            .order_by("title", "date_watched", "id")
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
        results = Movie.objects.filter(actors__contains=[actor]).distinct("title")
        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)


class ActressDetailView(APIView):
    def get(self, request, *args, **kwargs):
        actress = request.GET.get("actress", "")
        results = Movie.objects.filter(actresses__contains=[actress]).distinct("title")
        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)


class ReleasedDetailView(APIView):
    def get(self, request, *args, **kwargs):
        released = request.GET.get("released", "")
        # released is an IntegerField; a non-numeric value would raise a 500
        if not released.isdigit():
            return Response([])
        results = Movie.objects.filter(released=released).distinct("title")
        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)


class HealthView(APIView):
    # public liveness check; skip auth so a bad token header can't fail it
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        return Response({"ok": True})
