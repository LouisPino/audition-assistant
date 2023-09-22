from django.shortcuts import render, redirect
from django.views.generic import CreateView, UpdateView, DeleteView, ListView
# from .models import Flower, Location
# from .forms import WateringForm

# Create your views here.

# def auditions(request)
# #    auditions = Audition.objects.all()
#    return render(request, 'auditions/index.html', {
#         'auditions': auditions
#     })

def about(request): 
    return render(request, 'about.html')