from django.urls import path
from . import views

urlpatterns = [
    path('ajouter-au-panier/<int:produit_id>/', views.ajouter_au_panier, name='ajouter_au_panier'),
    path('voir/', views.voir_panier, name='voir_panier'),
    path('passer-commande/', views.passer_commande, name='passer_commande'),
    path('confirmation-paiement/', views.confirmation_commande_paydunya, name='confirmation_paiement'),
    path('echec_paiement/', views.echec_paiement, name='echec_paiement'),
    path('webhook-paydunya/', views.paydunya_webhook, name='paydunya_webhook'),
    path('paiement-success/', views.paiement_success, name='paiement_success'),
    # Vous pouvez également remettre la vue confirmation_commande si vous en avez besoin plus tard
    # path('confirmation/<int:commande_id>/', views.confirmation_commande, name='confirmation_commande'),
]