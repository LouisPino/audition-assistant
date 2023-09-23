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
    path('excerpts/delete/<int:pk>', views.ExcerptDelete.as_view(), name="excerpt_delete"),
    path('excerpts/update/<int:pk>/<int:aud_id>', views.ExcerptUpdate.as_view(), name="excerpt_update"),
    
    
    
    
    path('accounts/signup/', views.signup, name='signup'),
]
