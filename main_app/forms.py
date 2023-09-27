from django.forms import ModelForm, modelformset_factory
from .models import *

class NoteForm(ModelForm):
  class Meta:
    model = Note
    fields = ['note']

class GoalForm(ModelForm):
  class Meta:
    model = Goal
    fields = ['goal']

LinkForm = modelformset_factory(Link, fields=('audio_link', 'start_time'), extra=2)