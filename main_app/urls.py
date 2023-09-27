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
    path('excerpts/add-multiple/<int:aud_id>', views.add_multiple, name="excerpt_add-multiple"),
    path('excerpts/import-multiple/<int:aud_id>', views.import_multiple, name="excerpt_import-multiple"),
    path('excerpts/delete/<int:pk>/<int:aud_id>', views.ExcerptDelete.as_view(), name="excerpt_delete"),
    path('excerpts/update/<int:pk>/', views.ExcerptUpdate.as_view(), name="excerpt_update"),
    path('excerpts/<int:ex_id>', views.excerpt_detail, name="excerpt_detail"),
    path('excerpts/<int:ex_id>/practiced', views.excerpt_practiced, name="excerpt_practiced"),
    path('excerpts/<int:ex_id>/current-tempo', views.excerpt_current_tempo, name="excerpt_current-tempo"),
    path('excerpts/<int:ex_id>/add_score/', views.add_score, name='add_score'),
    path('excerpts/<int:ex_id>/add_links/', views.add_links, name='add_links'),
   
    path('goals/create/<int:aud_id>', views.create_goal, name="goal_create"),
    path('goals/delete/<int:aud_id>', views.clear_goals, name="clear_goals"),
    path('goals/complete/<int:goal_id>/<int:aud_id>', views.goal_complete, name="goal_complete"),
   
    path('notes/create/<int:ex_id>', views.create_note, name="note_create"),
    path('notes/delete/<int:pk>/<int:ex_id>', views.NoteDelete.as_view(), name="note_delete"),
    path('notes/update/<int:pk>/', views.NoteUpdate.as_view(), name="note_update"),
    
    path('accounts/signup/', views.signup, name='signup'),
]