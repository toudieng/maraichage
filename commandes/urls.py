from django.urls import path
from . import views
from . import api_views

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

    path('gestion/', views.tableau_bord_commandes, name='tableau_bord_commandes'),
    path('gestion/update_statut/<int:commande_id>/', views.mettre_a_jour_statut, name='mettre_a_jour_statut'),

    path('livreur/dashboard/', views.tableau_de_bord_livreur, name='tableau_de_bord_livreur'),
    path('livreur/valider/<int:commande_id>/', views.valider_livraison, name='valider_livraison'),

    # Panier
    path('api/panier/add/', api_views.api_ajouter_au_panier),
    path('api/panier/', api_views.api_voir_panier),
    path('api/panier/update/', api_views.api_update_panier_item),
    path('api/panier/remove/', api_views.api_remove_panier_item),
    path('api/panier/clear/', api_views.api_clear_panier),

    # Commande
    path('api/commande/valider/', api_views.api_valider_commande),
    path('api/commande/details/<int:commande_id>/', api_views.api_details_commande),
    path('api/commande/historique/', api_views.api_historique_commandes),

    # Paiement
    path('api/commande/webhook/', api_views.api_paydunya_webhook),
]