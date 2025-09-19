from django.shortcuts import render
from .models import Produit
from .utils import get_prix_actuel

def liste_produits(request):
    produits = Produit.objects.all()
    
    liste_avec_prix_saisonniers = []
    for produit in produits:
        produit.prix_actuel = get_prix_actuel(produit)
        liste_avec_prix_saisonniers.append(produit)
        
    return render(request, 'produits/liste_produits.html', {'produits': liste_avec_prix_saisonniers})
