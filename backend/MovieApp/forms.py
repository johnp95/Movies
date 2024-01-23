from django import forms
from .models import Movie

class MovieForm(forms.ModelForm):
    class Meta:
        model  = Movie
        fields = ['title','director','actor','actress','date_watched','released','language','movie_images','best_picture','female_director']
        labels = {
            'title': '',
            'director': '',
            'actor': '',
            'actress': '',
            'date_watched': '',
            'released': '',
            'language': '',
            'movie_images':'',
            'best_picture': 'Best Picture Winner?',
            'female_director': 'Female Directed?',

        }
        widgets = {
            'title': forms.TextInput(attrs={'class':'form-control-sm', 'placeholder': 'Tite'}),
            'director': forms.TextInput(attrs={'class':'form-control-sm', 'placeholder': 'Director'}),
            'actor': forms.TextInput(attrs={'class':'form-control-sm', 'placeholder': 'Actor'}),
            'actress': forms.TextInput(attrs={'class':'form-control-sm', 'placeholder': 'Actress'}),
            'date_watched': forms.TextInput(attrs={'class':'form-control-sm', 'placeholder': 'Date Watched'}),
            'released': forms.TextInput(attrs={'class':'form-control-sm', 'placeholder': 'Year Released'}),
            'language': forms.TextInput(attrs={'class':'form-control-sm', 'placeholder': 'Language'}),
            'movie_images': forms.ClearableFileInput(attrs={'class':'form-control-sm'}),
        }