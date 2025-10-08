from django.urls import path
from . import views

urlpatterns = [
    path('ajouter-au-panier/<int:produit_id>/', views.ajouter_au_panier, name='ajouter_au_panier'),
    path('voir/', views.voir_panier, name='voir_panier'),
    #path('passer-commande/', views.passer_commande, name='passer_commande'),
    path('validation/', views.validation_commande, name='validation_commande'),
    path('echec_paiement/', views.echec_paiement, name='echec_paiement'),
    path('webhook-paydunya/', views.paydunya_webhook, name='paydunya_webhook'),
    path('paiement-success/', views.paiement_success, name='paiement_success'),
    path('details/<int:commande_id>/', views.details_commande, name='details_commande'),
    path('historique/', views.historique_commandes, name='historique_commandes'),
]