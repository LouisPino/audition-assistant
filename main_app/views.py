from typing import Any
from django import http
from django.http import QueryDict
from django.shortcuts import render, redirect
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.db.models import Q
import uuid
import boto3
import os
import requests
import re

from .models import *
from .forms import *

#audition index
@login_required
def auditions(request):
    auditions = Audition.objects.filter(
        user_id=request.user.id).order_by('-date')
    upcoming_auditions = []
    previous_auditions = []
    for audition in auditions:
        if audition.date >= date.today():
            upcoming_auditions.append(audition)
        else:
            previous_auditions.append(audition)
    return render(request, 'auditions/index.html', {
        'upcoming_auditions': upcoming_auditions,
        'previous_auditions': previous_auditions
    })


def about(request):
    return render(request, 'about.html')


def home(request):
    return redirect('about')

#render form and create user
def signup(request):
    error_message = ''
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('audition_index')
        else:
            error_message = 'Invalid sign up - try again'
    form = UserCreationForm()
    context = {'form': form, 'error_message': error_message}
    return render(request, 'registration/signup.html', context)


class AuditionCreate(LoginRequiredMixin, CreateView):
    model = Audition
    fields = ["orchestra", "location", "date"]

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class AuditionUpdate(LoginRequiredMixin, UpdateView):
    model = Audition
    fields = ["orchestra", "location", "date"]

@login_required
def audition_detail(request, aud_id):
    audition = Audition.objects.get(id=aud_id)
    excerpts = audition.excerpt_set.all().order_by('last_practiced')
    excerpt_objs = {}
    goal_form = GoalForm()
    goals = Goal.objects.filter(audition_id=aud_id).order_by('-id')
    for excerpt in excerpts:
        if excerpt.instrument in excerpt_objs.keys():
            excerpt_objs[excerpt.instrument].append(excerpt)
        else:
            excerpt_objs[excerpt.instrument] = [excerpt]

    return render(request, 'auditions/detail.html', {'audition': audition, 'excerpts': excerpts, 'excerpt_objs': excerpt_objs, 'goal_form': goal_form, 'goals': goals})


class AuditionDelete(LoginRequiredMixin, DeleteView):
    model = Audition
    success_url = '/auditions'


class ExcerptCreate(LoginRequiredMixin, CreateView):
    model = Excerpt
    fields = ['title', 'composer', 'instrument', 'section', "goal_tempo_bpm"]

    def form_valid(self, form):
        form.instance.audition_id = self.kwargs.get('aud_id')
        if form.instance.instrument:
            form.instance.instrument = form.instance.instrument.capitalize()
        super().form_valid(form)
        return redirect('audition_detail', aud_id=self.kwargs['aud_id'])


class ExcerptDelete(LoginRequiredMixin, DeleteView):
    model = Excerpt

    def get_success_url(self):
        next_id = self.kwargs['aud_id']
        return reverse('audition_detail', kwargs={'aud_id': next_id})


class ExcerptUpdate(LoginRequiredMixin, UpdateView):
    model = Excerpt
    fields = ['title', 'composer', 'instrument',
              'section', "goal_tempo_bpm", "current_tempo"]

    def form_valid(self, form):
        super().form_valid(form)
        return redirect('excerpt_detail', ex_id=form.instance.id)

#Render excerpt detail page, parse through composer name and fetch openopus api composer details
@login_required
def excerpt_detail(request, ex_id):
    excerpt = Excerpt.objects.get(id=ex_id)
    comp_name = re.split(r'[ -]', excerpt.composer)[-1]
    res = requests.get(
        f'https://api.openopus.org/composer/list/search/{comp_name[:8]}.json')
    comp_obj = res.json()
    if comp_obj['status']['success'] == 'true':
        composer = comp_obj['composers'][0]
        composer['birth'] = composer['birth'][:4]
        if composer['death']:
            composer['death'] = composer['death'][:4]
    else:
        composer = {}
    note_form = NoteForm()
    notes = excerpt.note_set.all().order_by('-date')
    links = excerpt.link_set.all()
    link_objs = []
    for link in links:
        if 'youtu' in link.audio_link:
            start_sec = int(link.start_time.split(
                ':')[0])*60 + int(link.start_time.split(':')[1]) if link.start_time else ""
            link_objs.append({
                'url': f"https://www.youtube.com/embed/{re.split(r'(v=|.be/|&)', link.audio_link)[2]}".split('?')[0],
                'start': start_sec,
                'start_display': link.start_time if link.start_time else ""
            })
        print(link_objs[0]['url'])
    return render(request, 'excerpts/detail.html', {
        'excerpt': excerpt, 'note_form': note_form, 'notes': notes,
        'links': link_objs,
        'comp_obj': composer, })


def create_note(request, ex_id):
    form = NoteForm(request.POST)
    if form.is_valid():
        new_note = form.save(commit=False)
        new_note.excerpt_id = ex_id
        new_note.date = date.today()
        new_note.save()
    return redirect('excerpt_detail', ex_id=ex_id)


class NoteDelete(LoginRequiredMixin, DeleteView):
    model = Note

    def get_success_url(self):
        ex_id = self.kwargs["ex_id"]
        return reverse('excerpt_detail', kwargs={'ex_id': ex_id})


class NoteUpdate(LoginRequiredMixin, UpdateView):
    model = Note
    fields = ['note', 'date']

@login_required
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

#render import excerpts page
@login_required
def add_multiple(request, aud_id):
    audition = Audition.objects.get(id=aud_id)
    excerpts = Excerpt.objects.filter(~Q(audition_id=aud_id), ~Q(
        section__in=audition.excerpt_set.all().values('section'))).distinct("title", 'section')
    excerpt_objs = {}
    for excerpt in excerpts:
        if excerpt.instrument in excerpt_objs.keys():
            excerpt_objs[excerpt.instrument].append(excerpt)
        else:
            excerpt_objs[excerpt.instrument] = [excerpt]

    return render(request, 'excerpts/add_multiple.html', {'excerpt_objs': excerpt_objs, 'aud_id': aud_id})

#import the excerpts
def import_multiple(request, aud_id):
    ex_ids = request.POST['ex_list'].split(',')
    if ex_ids[0] == '':
        return redirect('audition_detail', aud_id=aud_id)
    excerpts = Excerpt.objects.filter(id__in=ex_ids)
    for excerpt in excerpts:
        links = [*excerpt.link_set.all()]
        excerpt.pk = None
        print('LINK LIST', links)
        excerpt.audition_id = aud_id
        excerpt.current_tempo = 0
        excerpt.last_practiced = date.today()
        excerpt.save()
        for link in links:
            link.pk = None
            link.excerpt_id = excerpt.id
            link.save()

    return redirect('audition_detail', aud_id=aud_id)

@login_required
def add_score(request, ex_id):
    photo_file = request.FILES.get('photo-file', None)
    if photo_file:
        filetype = photo_file.name.split('.')[-1]
        s3 = boto3.client('s3')
        key = uuid.uuid4().hex[:6] + \
            photo_file.name[photo_file.name.rfind('.'):]
        try:
            bucket = os.environ['S3_BUCKET']
            s3.upload_fileobj(photo_file, bucket, key)
            url = f"{os.environ['S3_BASE_URL']}{bucket}/{key}"
            excerpt = Excerpt.objects.get(id=ex_id)
            excerpt.score_url = url
            excerpt.score_type = filetype
            excerpt.save()
        except Exception as e:
            print('An error occurred uploading file to S3')
            print(e)
    return redirect('excerpt_detail', ex_id=ex_id)

@login_required
def create_goal(request, aud_id):
    form = GoalForm(request.POST)
    if form.is_valid():
        new_goal = form.save(commit=False)
        new_goal.audition_id = aud_id
        new_goal.complete = False
        new_goal.save()
    return redirect('audition_detail', aud_id=aud_id)


def goal_complete(request, goal_id, aud_id):
    goal = Goal.objects.get(id=goal_id)
    goal.complete = True
    goal.save()
    return redirect('audition_detail', aud_id=aud_id)


def clear_goals(request, aud_id):
    Goal.objects.filter(audition_id=aud_id, complete=True).delete()
    return redirect('audition_detail', aud_id=aud_id)

@login_required
def add_links(request, ex_id):
    form = LinkForm(queryset=Link.objects.filter(excerpt_id=ex_id))

    if request.method == 'POST':
        form = LinkForm(request.POST)
        instances = form.save(commit=False)
        for instance in instances:
            instance.excerpt_id = ex_id
            instance.save()
        return redirect('excerpt_detail', ex_id=ex_id)

    return render(request, 'excerpts/link_form.html', {'form': form, 'ex_id': ex_id})

@login_required
def journal_index(request):
    entries = JournalEntry.objects.filter(
        user_id=request.user.id).order_by('-date')
    entry_objs = {}
    for entry in entries:
        month = str(entry.date).split('-')[1]
        if month in entry_objs.keys():
            entry_objs[month].append(entry)
        else:
            entry_objs[month] = [entry]

    return render(request, 'journal/index.html', {'entries': entry_objs})

@login_required
def entry_detail(request, ent_id):
    entry = JournalEntry.objects.get(id=ent_id)
    tasks = entry.journaltask_set.all()
    return render(request, 'journal/detail.html', {'entry': entry, 'tasks': tasks})

@login_required
def entry_create(request):
    jform = JournalForm(queryset=JournalTask.objects.filter(entry_id=0))
    if request.method == 'POST':
        form = JournalForm(request.POST)
        if form.is_valid():
            new_entry = JournalEntry.objects.create(
                date=date.today(), user_id=request.user.id)
            new_tasks = form.save(commit=False)
            for task in new_tasks:
                task.entry_id = new_entry.id
                task.save()
            return redirect('journal_index')

    return render(request, 'journal/create.html', {'formset': jform})

@login_required
def entry_update(request, ent_id):
    JournalTaskFormSet = modelformset_factory(
        JournalTask, form=JournalTaskForm, fields=('task', 'time'), extra=10)
    if request.method == 'POST':
        formset = JournalTaskFormSet(request.POST)
        if formset.is_valid():
            new_tasks = formset.save(commit=False)
            for task in new_tasks:
                task.entry_id = ent_id
                task.save()
            return redirect('entry_detail', ent_id=ent_id)
    else:
        formset = JournalTaskFormSet(
            queryset=JournalTask.objects.filter(entry_id=0))

    return render(request, 'journal/create.html', {'formset': formset})

@login_required
def clear_tasks(request, ent_id):
    JournalTask.objects.filter(entry_id=ent_id, completed=True).delete()
    return redirect('entry_detail', ent_id=ent_id)


class EntryDelete(LoginRequiredMixin, DeleteView):
    model = JournalEntry
    success_url = '/journal'

@login_required
def task_complete(request, task_id, ent_id):
    task = JournalTask.objects.get(id=task_id)
    task.completed = True
    task.save()
    return redirect('entry_detail', ent_id=ent_id)
