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

LinkForm = modelformset_factory(Link, fields=('audio_link', 'start_time'), extra=3, max_num=3)


class JournalTaskForm(forms.ModelForm):
      class Meta:
        model = JournalTask
        fields = ('task', 'time',)
        widgets = {
            'task': forms.Textarea(attrs={'class': 'journal-task-input', 'rows': '3', 'cols': '5'}),
            'time': forms.NumberInput(attrs={'class': 'journal-time-input', 'min': '1'}),
        }


JournalForm = modelformset_factory(JournalTask, form=JournalTaskForm, fields=('task', 'time'), extra=10,)