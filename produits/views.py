from django.shortcuts import render
from .models import Produit
from .utils import get_prix_actuel
from django.shortcuts import get_object_or_404
from .serializers import ProduitSerializer
from rest_framework import generics

def liste_produits(request):
    produits = Produit.objects.all()
    
    liste_avec_prix_saisonniers = []
    for produit in produits:
        produit.prix_actuel = get_prix_actuel(produit)
        liste_avec_prix_saisonniers.append(produit)
        
    return render(request, 'produits/liste_produits.html', {'produits': liste_avec_prix_saisonniers})


def details_produit(request, produit_id):
    """
    Affiche les détails d'un produit spécifique, y compris son stock.
    """
    # Utilise get_object_or_404 pour gérer le cas où le produit n'existe pas
    produit = get_object_or_404(Produit, id=produit_id)
    
    context = {
        'produit': produit,
    }
    return render(request, 'produits/details_produit.html', context)

class ProduitListAPIView(generics.ListAPIView):
    # Ceci récupère tous les objets Produit de la base de données
    queryset = Produit.objects.all() 
    serializer_class = ProduitSerializer
