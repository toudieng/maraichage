from django.urls import path, include
from . import views
from . import api_urls

urlpatterns = [
    path('profil/', views.profil, name='profil'),
    path('compte/', views.hub_compte, name='hub_compte'),
    path('api/', include(api_urls)),

    path('gestion/', views.tableau_bord_utilisateurs, name='tableau_bord_utilisateurs'),
    
    path('gestion/ajouter/', views.ajouter_utilisateur, name='ajouter_utilisateur'),
    path('gestion/modifier/<int:user_id>/', views.modifier_utilisateur, name='modifier_utilisateur'), 
    path('gestion/supprimer/<int:user_id>/', views.supprimer_utilisateur, name='supprimer_utilisateur'),
]