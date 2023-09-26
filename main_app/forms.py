from django.forms import ModelForm
from .models import *

class NoteForm(ModelForm):
  class Meta:
    model = Note
    fields = ['note']

class GoalForm(ModelForm):
  class Meta:
    model = Goal
    fields = ['goal']