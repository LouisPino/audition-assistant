from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse
from django.contrib.auth.models import User
from datetime import date
from django import forms

# Create your models here.

TEMPO_TYPES = (
  ('E', '♪ (eighth)'),
  ('Q', '♩ (quarter)'),
  ('H', '(half)'),
  ('W', '(whole)')
)


class Audition(models.Model):
    orchestra= models.CharField(max_length=100)
    location= models.CharField(max_length=100)
    date= models.DateField()
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    # instruments= ArrayField(models.CharField(max_length=50), size= 55)
    def __str__(self):
        return f'{self.orchestra[:10]}'
    
    def get_absolute_url(self):
        return reverse("audition_detail", kwargs={"aud_id": self.id})


class Excerpt(models.Model):
    title= models.CharField(max_length=100)
    composer= models.CharField(max_length=100)
    instrument= models.CharField(max_length=100, null=True, blank=True)
    goal_tempo_type = models.CharField(max_length=1, choices=TEMPO_TYPES, default='Q')
    goal_tempo_bpm= models.IntegerField(null=True, blank=True)
    section = models.CharField(max_length=100)
    current_tempo = models.IntegerField(null=True, blank=True)
    audio_links = models.TextField( null=True, blank=True, verbose_name='Spotify Links', help_text="separate by commas")
    start_times =models.CharField(null=True, blank=True, verbose_name='excerpt time', help_text="in same order as links")
    last_practiced = models.DateField(null=True, blank=True)
    audition = models.ForeignKey(Audition, on_delete=models.CASCADE)
    score_url = models.CharField(max_length=200)
    score_type = models.CharField(max_length=4)
    
    def __str__(self):
        return f'{self.title}, {self.section} : last practiced {self.last_practiced}'
    
    def get_absolute_url(self):
        return reverse("audition_detail", kwargs={"aud_id": self.id})
    
    def practiced_today(self):
        if self.last_practiced==date.today():
            return True if self.last_practiced==date.today() else False
        


class Note(models.Model):
    excerpt= models.ForeignKey(Excerpt, on_delete=models.CASCADE)
    date= models.DateField()
    note= models.TextField()
    def __str__(self):
        return f'{self.date} ({self.excerpt}: {self.note[:10]}...)'
    
    def get_absolute_url(self):
        return reverse('excerpt_detail', kwargs={"ex_id": self.excerpt_id})




class Goal(models.Model):
    audition= models.ForeignKey(Audition, on_delete=models.CASCADE)
    goal= models.TextField()
    complete= models.BooleanField()
    def __str__(self):
        return f'{self.goal[:10]}...)'
    
    def get_absolute_url(self):
        return reverse('audition_detail', kwargs={"aud_id": self.audition_id})
