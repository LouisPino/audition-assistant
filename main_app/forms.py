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

LinkForm = modelformset_factory(Excerpt, fields=('audio_links', 'start_times'), extra=2)