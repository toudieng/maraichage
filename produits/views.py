from django.shortcuts import render
from .models import Produit
from .utils import get_prix_actuel
from django.shortcuts import get_object_or_404
from .serializers import ProduitSerializer
from rest_framework import generics
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import ProduitForm


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

class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer


def is_staff_user(user):
    # Assurez-vous que cette fonction vérifie le niveau d'accès souhaité
    return user.is_staff 

@login_required
@user_passes_test(is_staff_user) # Seul le personnel autorisé peut voir cette page
def tableau_bord_produits(request):
    """
    Affiche la liste de tous les produits gérés par le personnel.
    """
    produits_qs = Produit.objects.all().order_by('nom')
    
    # Vous pouvez ajouter ici la logique de recherche et de pagination si nécessaire
    
    context = {
        'produits_qs': produits_qs,
        'is_admin': request.user.is_superuser, # Pour le menu de la navbar_pro
    }
    
    return render(request, 'produits/tableau_bord_produits.html', context)


@login_required
@user_passes_test(is_staff_user)
def ajouter_modifier_produit(request, produit_id=None):
    """
    Gère l'ajout d'un nouveau produit (si produit_id est None) ou la modification (sinon).
    """
    # Détermine s'il s'agit d'une modification ou d'un ajout
    if produit_id:
        produit = get_object_or_404(Produit, pk=produit_id)
        action_label = "Modifier"
    else:
        produit = None
        action_label = "Ajouter"
        
    if request.method == 'POST':
        # Lors d'une soumission, lier le formulaire aux données POST et au fichier (image)
        form = ProduitForm(request.POST, request.FILES, instance=produit)
        if form.is_valid():
            form.save()
            
            # Message de succès
            msg = f"Le produit '{form.instance.nom}' a été {action_label} avec succès."
            messages.success(request, msg)
            
            return redirect('tableau_bord_produits')
    else:
        # Afficher le formulaire
        form = ProduitForm(instance=produit)

    context = {
        'form': form,
        'action_label': action_label,
        'produit': produit,
    }
    
    # Assurez-vous que le template est bien 'produits/formulaire_produit.html'
    return render(request, 'produits/formulaire_produit.html', context)


@login_required
@user_passes_test(is_staff_user)
def supprimer_produit(request, produit_id):
    """
    Supprime un produit.
    """
    produit = get_object_or_404(Produit, pk=produit_id)

    if request.method == 'POST':
        produit_nom = produit.nom
        produit.delete()
        messages.warning(request, f"Le produit '{produit_nom}' a été supprimé.")
        return redirect('tableau_bord_produits')
        
    # Si la méthode n'est pas POST (on affiche une page de confirmation, par sécurité)
    return render(request, 'produits/confirmation_suppression.html', {'produit': produit})