from django.urls import path
from . import views

urlpatterns = [
    path('profil/', views.profil, name='profil'),
    path('compte/', views.hub_compte, name='hub_compte'),
]