from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('about/', views.about, name="about"),
    path('auditions/', views.auditions, name="audition_index"),
    path('auditions/create', views.AuditionCreate.as_view(), name="audition_create"),
    path('auditions/<int:aud_id>', views.audition_detail, name="audition_detail"),
    path('auditions/update/<int:pk>', views.AuditionUpdate.as_view(), name="audition_update"),
    path('auditions/delete/<int:pk>', views.AuditionDelete.as_view(), name="audition_delete"),
   
    path('excerpts/create/<int:aud_id>', views.ExcerptCreate.as_view(), name="excerpt_create"),
    path('excerpts/delete/<int:pk>/', views.ExcerptDelete.as_view(), name="excerpt_delete"),
    path('excerpts/update/<int:pk>/', views.ExcerptUpdate.as_view(), name="excerpt_update"),
    path('excerpts/<int:ex_id>', views.excerpt_detail, name="excerpt_detail"),
   
    path('notes/create/<int:ex_id>', views.create_note, name="note_create"),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name="note_delete"),
    path('notes/update/<int:pk>/', views.NoteUpdate.as_view(), name="note_update"),
    
    path('accounts/signup/', views.signup, name='signup'),
]