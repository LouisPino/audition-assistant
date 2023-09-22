from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    # path('/auditions', views.auditions),
    path('about/', views.about),
]
