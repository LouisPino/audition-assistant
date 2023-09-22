from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse
from django.contrib.auth.models import User
from datetime import date
# Create your models here.

TEMPO_TYPES = (
  ('B', 'Breakfast'),
  ('L', 'Lunch'),
  ('D', 'Dinner'),
)


class Excerpt(models.Model):
    title= models.CharField(max_length=100)
    composer= models.CharField(max_length=100)
    # instrument= models.CharField(max_length=100)
    # goal_tempo_type = models.CharField()
    goal_tempo_bpm= models.IntegerField()
    section = models.CharField(max_length=100)
    current_tempo = models.IntegerField()
    audio_link = models.CharField()
    start_time = models.TimeField()
    last_practiced = models.DateField()
    

class Audition(models.Model):
    orchestra= models.CharField(max_length=100)
    location= models.CharField(max_length=100)
    date= models.DateField()
    excerpts = models.ManyToManyField(Excerpt)
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    # instruments= ArrayField(models.CharField(max_length=2), size= 50)


class Note(models.Model):
    excerpt= models.ForeignKey(Excerpt, on_delete=models.CASCADE)
    date= models.DateField()
    note= models.TextField()