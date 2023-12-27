from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics
from MovieApp.models import Movie
from .serializers import MovieSerializer
from rest_framework.views import APIView

@api_view(['GET', 'POST'])
def movie_list(request):
    if request.method == 'GET':
        queryset = Movie.objects.all().order_by('id')
        serializer = MovieSerializer(queryset, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieList(generics.ListCreateAPIView):
    queryset = Movie.objects.all().order_by('-date_watched')
    serializer_class = MovieSerializer


class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all().order_by('id')
    serializer_class = MovieSerializer

class MovieSearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.GET.get('query', '')
        results = Movie.objects.filter(title__icontains=query).order_by('id') | \
                  Movie.objects.filter(director__icontains=query).order_by('id') | \
                  Movie.objects.filter(actor__icontains=query).order_by('id') | \
                  Movie.objects.filter(actress__icontains=query).order_by('id')

        serialized_results = MovieSerializer(results, many=True).data
        return Response(serialized_results)
