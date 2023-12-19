from rest_framework import serializers
from MovieApp.models import Movie

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        # fields = ('id','title','director','actor','actress','date_watched','released')
        fields = '__all__'
