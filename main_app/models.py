from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse
from django.contrib.auth.models import User
from datetime import date
# Create your models here.

TEMPO_TYPES = (
  ('E', 'Eighth Note'),
  ('Q', 'Quarter Note'),
  ('H', 'Half Note'),
  ('W', 'Whole Note')
)


class Excerpt(models.Model):
    def get_instruments(self):
        instruments_available = self.audition_set.all().values('instruments').split(',')
        return instruments_available
    
    title= models.CharField(max_length=100)
    composer= models.CharField(max_length=100)
    instrument= models.CharField(max_length=100, null=True, blank=True) #CHECK HOW JIM DID TOYS
    goal_tempo_type = models.CharField(max_length=1, choices=TEMPO_TYPES, default='Q')
    goal_tempo_bpm= models.IntegerField(null=True, blank=True)
    section = models.CharField(max_length=100)
    current_tempo = models.IntegerField(null=True, blank=True)
    audio_link = models.CharField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    last_practiced = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f'{self.title[:8]}'
    
    

class Audition(models.Model):
    orchestra= models.CharField(max_length=100)
    location= models.CharField(max_length=100)
    date= models.DateField()
    excerpts = models.ManyToManyField(Excerpt)
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    # instruments= ArrayField(models.CharField(max_length=2), size= 50)
    def __str__(self):
        return f'{self.orchestra[:10]}'
    


class Note(models.Model):
    excerpt= models.ForeignKey(Excerpt, on_delete=models.CASCADE)
    date= models.DateField()
    note= models.TextField()
    def __str__(self):
        return f'{self.date} ({self.excerpt})'