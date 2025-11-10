from django.urls import path
from . import views
from .views import ProduitListAPIView

urlpatterns = [
    path('', views.liste_produits, name='liste_produits'),
    path('<int:produit_id>/', views.details_produit, name='details_produit'),
    path('api/produits/', ProduitListAPIView.as_view(), name='produit-list-api'),
    path('api/produits/<int:pk>/', views.ProductDetailAPIView.as_view(), name='product-detail'),

    path('gestion/', views.tableau_bord_produits, name='tableau_bord_produits'),
    path('gestion/ajouter/', views.ajouter_modifier_produit, name='ajouter_produit'),
    path('gestion/modifier/<int:produit_id>/', views.ajouter_modifier_produit, name='modifier_produit'),
    path('gestion/supprimer/<int:produit_id>/', views.supprimer_produit, name='supprimer_produit'),
]