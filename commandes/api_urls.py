from django.urls import path
from . import api_views
from django.views.decorators.csrf import ensure_csrf_cookie

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
    path('api/csrf/', api_views.get_csrf_token, name='csrf'),


    # Paiement
    path('api/commande/<int:commande_id>/verify-payment/', api_views.api_verify_payment, name='api_verify_payment'),
    path('api/commande/webhook/', api_views.api_paydunya_webhook, name='paydunya_webhook'),
    path('api/commande/<int:id>/facture/', api_views.api_facture_commande, name='api_facture_commande'),
]