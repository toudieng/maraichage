from django.urls import path
from . import views

urlpatterns = [
    path('profil/', views.profil, name='profil'),
]