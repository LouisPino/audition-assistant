from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import date
from django import forms

# Create your models here.



class Audition(models.Model):
    orchestra= models.CharField(max_length=100)
    location= models.CharField(max_length=100)
    date= models.DateField()
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.orchestra[:10]}'
    
    def get_absolute_url(self):
        return reverse("audition_detail", kwargs={"aud_id": self.id})
    
    def one_goal_completed(self):
        if len(self.goal_set.filter(audition_id=self.id, complete=True)) > 0:
            return True
        else:
            return False


class Excerpt(models.Model):
    title= models.CharField(max_length=100)
    composer= models.CharField(max_length=100)
    instrument= models.CharField(max_length=100, null=True, blank=True)
    goal_tempo_bpm= models.IntegerField(null=True, blank=True, verbose_name='Goal Tempo')
    section = models.CharField(max_length=100)
    current_tempo = models.IntegerField(null=True, blank=True, )
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
    
    
class Link(models.Model):
    audio_link = models.CharField( null=True, blank=True, verbose_name='Youtube Link')
    start_time =models.CharField(null=True, blank=True, verbose_name='excerpt time (mm:ss)')
    excerpt = models.ForeignKey(Excerpt, on_delete=models.CASCADE)

    def get_absolute_url(self):
        return reverse("excerpt_detail", kwargs={"ex_id": self.kwargs['ex_id']})
    
    
class JournalEntry(models.Model):
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def get_absolute_url(self):
        return reverse("journal_detail", kwargs={"j_id": self.kwargs['j_id']})

class JournalTask(models.Model):
    entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE)
    task = models.TextField(verbose_name='What did you practice?')
    time = models.IntegerField(verbose_name='How many minutes', null=True, blank=True)
    completed = models.BooleanField(default = False)
    
    def get_absolute_url(self):
        return reverse("journal_detail", kwargs={"j_id": self.kwargs['j_id']})