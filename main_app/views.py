from typing import Any
from django import http
from django.shortcuts import render, redirect
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic import ListView, DetailView
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
import uuid
import boto3
import os
from .models import *
from .forms import NoteForm


def auditions(request):
   auditions = Audition.objects.all()
   return render(request, 'auditions/index.html', {
        'auditions': auditions
    })

def about(request): 
    return render(request, 'about.html')

def home(request): 
    return redirect('about')


def signup(request):
  error_message = ''
  if request.method == 'POST':
    # This is how to create a 'user' form object
    # that includes the data from the browser
    form = UserCreationForm(request.POST)
    if form.is_valid():
      # This will add the user to the database
      user = form.save()
      # This is how we log a user in via code
      login(request, user)
      return redirect('index')
    else:
      error_message = 'Invalid sign up - try again'
  # A bad POST or a GET request, so render signup.html with an empty form
  form = UserCreationForm()
  context = {'form': form, 'error_message': error_message}
  return render(request, 'registration/signup.html', context)

class AuditionCreate(CreateView):
    model= Audition
    fields= ["orchestra","location","date"]
    
    def form_valid(self, form):
      form.instance.user = self.request.user
      return super().form_valid(form)

class AuditionUpdate(UpdateView):
    model= Audition
    fields= ["orchestra","location","date"]
    
def audition_detail(request, aud_id):
    audition = Audition.objects.get(id=aud_id)
    excerpts = audition.excerpt_set.all().order_by('last_practiced')
    excerpt_objs = {}
    for excerpt in excerpts:
      if excerpt.instrument in excerpt_objs.keys():
        excerpt_objs[excerpt.instrument].append(excerpt)
      else:
        excerpt_objs[excerpt.instrument] = [excerpt]
        
    return render(request, 'auditions/detail.html', {'audition': audition, 'excerpts': excerpts, 'excerpt_objs': excerpt_objs})
  
class AuditionDelete(DeleteView):
  model=Audition
  success_url = '/auditions'

  
class ExcerptCreate(CreateView):
    model= Excerpt
    fields= ['title', 'composer', 'instrument', 'section', "goal_tempo_type", "goal_tempo_bpm"]
    
    
    def form_valid(self, form):
      form.instance.audition_id=self.kwargs.get('aud_id')
      super().form_valid(form)
      return redirect('audition_detail', aud_id= self.kwargs['aud_id'])
    
class ExcerptDelete(DeleteView):
  model=Excerpt
  success_url = f'/auditions/'
  
    
class ExcerptUpdate(UpdateView):
    model= Excerpt
    fields= ['title', 'composer', 'instrument', 'section', "goal_tempo_type", "goal_tempo_bpm", "current_tempo", 'audio_links', 'start_times']
    
    def form_valid(self, form):
        super().form_valid(form)
        return redirect('excerpt_detail', ex_id=form.instance.id)
      
      
      
def excerpt_detail(request, ex_id):
    excerpt = Excerpt.objects.get(id=ex_id)
    excerpt.goal_tempo_type=excerpt.get_goal_tempo_type_display()[0]
    note_form = NoteForm()
    notes = Note.objects.filter(excerpt_id=ex_id).order_by('-date')
    if excerpt.audio_links:
      links = map(lambda link: f"https://open.spotify.com/embed/track/{link.split('/')[4]}?utm_source=generator", excerpt.audio_links )
    else:
      links = []
    link_objs =[]
    
    for idx, link in enumerate(links):
      link_objs.append({
        'url': link,
        'start': excerpt.start_times[idx] if len(excerpt.start_times) > idx else ""
      })
    return render(request, 'excerpts/detail.html', {'excerpt': excerpt, 'note_form': note_form, 'notes': notes, 'links': link_objs})
  

def create_note(request, ex_id):
  form = NoteForm(request.POST)
  if form.is_valid():
    new_note = form.save(commit=False)
    new_note.excerpt_id=ex_id
    new_note.date=date.today()
    new_note.save()
  return redirect('excerpt_detail', ex_id=ex_id)
    
class NoteDelete(DeleteView):
  model=Note
  success_url = f'/auditions/'
  
    
class NoteUpdate(UpdateView):
    model= Note
    fields= ['note', 'date']
     
     
     
def excerpt_practiced(request, ex_id):
  excerpt = Excerpt.objects.get(id=ex_id)
  excerpt.last_practiced = date.today()
  excerpt.save()
  return redirect('excerpt_detail', ex_id=ex_id)

def excerpt_current_tempo(request, ex_id):
  excerpt = Excerpt.objects.get(id=ex_id)
  excerpt.current_tempo = request.POST['current-tempo']
  excerpt.save()
  return redirect('excerpt_detail', ex_id=ex_id)


def add_multiple(request, aud_id):
  excerpts = Excerpt.objects.all().distinct("title", 'section')
  excerpt_objs = {}
  for excerpt in excerpts:
      if excerpt.instrument in excerpt_objs.keys():
        excerpt_objs[excerpt.instrument].append(excerpt)
      else:
        excerpt_objs[excerpt.instrument] = [excerpt]
        
  return render(request, 'excerpts/add_multiple.html', {'excerpt_objs': excerpt_objs, 'aud_id': aud_id})

def import_multiple(request, aud_id):
  ex_ids = request.POST['ex_list'].split(',')
  excerpts = Excerpt.objects.filter(id__in=ex_ids)
  for excerpt in excerpts:
    excerpt.pk = None
    excerpt.audition_id = aud_id
    excerpt.save()

  return redirect('audition_detail', aud_id=aud_id)