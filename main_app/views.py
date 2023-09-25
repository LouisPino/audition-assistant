from typing import Any
from django import http
from django.shortcuts import render, redirect
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic import ListView, DetailView
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.db.models import Q
import uuid
import boto3
import os
from .models import *
from .forms import NoteForm


def auditions(request):
   auditions = Audition.objects.all().order_by('-date')
   upcoming_auditions = []
   previous_auditions = []
   for audition in auditions:
     if audition.date >= date.today():
       upcoming_auditions.append(audition)
     else:
       previous_auditions.append(audition)
  #  upcoming_auditions = Audition.objects.filter(date__gte=date.today()).order_by('-date') TWO DB Calls, prob no good
  #  previous_auditions = Audition.objects.filter(date__lte=date.today()).order_by('-date')
   return render(request, 'auditions/index.html', {
        'upcoming_auditions': upcoming_auditions,
        'previous_auditions': previous_auditions
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
    fields= ['title', 'composer', 'instrument', 'section', "goal_tempo_type", "goal_tempo_bpm", 'audio_links', 'start_times']
    
    def form_valid(self, form):
      form.instance.audition_id=self.kwargs.get('aud_id')
      if form.instance.instrument:
        form.instance.instrument=form.instance.instrument.capitalize()
      super().form_valid(form)
      return redirect('audition_detail', aud_id= self.kwargs['aud_id'])
    
    
    
class ExcerptDelete(DeleteView):
  model=Excerpt
  def get_success_url(self):
        next_id = self.kwargs['aud_id']
        return reverse('audition_detail', kwargs={'aud_id': next_id})
      
  
    
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
  def get_success_url(self):
     ex_id = self.kwargs["ex_id"]
     return reverse('excerpt_detail', kwargs={'ex_id':ex_id})
  
    
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
  excerpts = Excerpt.objects.filter(~Q(audition_id=aud_id)).distinct("title", 'section')
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

def add_score(request, ex_id):
  # photo-file will be the "name" attribute on the <input type="file">
    photo_file = request.FILES.get('photo-file', None)
    if photo_file:
        filetype = photo_file.name.split('.')[-1]
        s3 = boto3.client('s3')
        # need a unique "key" for S3 / needs image file extension too
        key = uuid.uuid4().hex[:6] + photo_file.name[photo_file.name.rfind('.'):]
        # just in case something goes wrong
        try:
            bucket = os.environ['S3_BUCKET']
            s3.upload_fileobj(photo_file, bucket, key)
            # build the full url string
            url = f"{os.environ['S3_BASE_URL']}{bucket}/{key}"
            # we can assign to cat_id or cat (if you have a cat object)
            # Score.objects.create(url=url, excerpt_id=ex_id)
            excerpt = Excerpt.objects.get(id=ex_id)
            excerpt.score_url=url
            excerpt.score_type=filetype
            excerpt.save()
        except Exception as e:
            print('An error occurred uploading file to S3')
            print(e)
    return redirect('excerpt_detail', ex_id=ex_id)