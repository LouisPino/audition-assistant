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
# from .forms import WateringForm


def auditions(request):
   auditions = Audition.objects.all()
   return render(request, 'auditions/index.html', {
        'auditions': auditions
    })

def about(request): 
    return render(request, 'about.html')

def home(request): 
    return render(request, 'home.html')


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
    # excerpt_ids = audition.excerpts.all().values_list('id')
    # excerpts = Excerpt.objects.filter(id__in=excerpt_ids)
    return render(request, 'auditions/detail.html', {'audition': audition})
  
class AuditionDelete(DeleteView):
  model=Audition
  success_url = '/auditions'
  
class ExcerptCreate(CreateView):
    model= Excerpt
    fields= ['title', 'composer', 'section']
    
    def form_valid(self, form):
      new_excerpt = form.save(commit=False)
      new_excerpt.audition.add(self.kwargs['aud_id']) 
      return super().form_valid(form)