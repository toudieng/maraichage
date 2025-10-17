from django.urls import path
from . import api_views

urlpatterns = [
    # Panier
    path('api/panier/add/', api_views.api_ajouter_au_panier),
    path('api/panier/', api_views.api_voir_panier),
    path('api/panier/update/', api_views.api_update_panier_item),
    path('api/panier/remove/', api_views.api_remove_panier_item),
    path('api/panier/clear/', api_views.api_clear_panier),

    # Commande
    path('api/commande/valider/', api_views.api_valider_commande),
    #path('api/commande/details/<int:commande_id>/', api_views.api_details_commande),
    #path('api/commande/historique/', api_views.api_historique_commandes),
    path('api/commande/<int:id>/', api_views.api_commande_detail, name='api_commande_detail'),
    path('api/mes-commandes/', api_views.api_historique_commandes, name='api_historique_commandes'),



    # Paiement
    path('api/commande/webhook/', api_views.api_paydunya_webhook),
    path('api/commande/<int:id>/facture/', api_views.api_facture_commande, name='api_facture_commande'),
]