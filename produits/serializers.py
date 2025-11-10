from rest_framework import serializers
from .models import Produit
from commandes.models import Details_panier
from .utils import get_prix_actuel 

class ProduitSerializer(serializers.ModelSerializer):
    prix_actuel = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Produit
        fields = (
            'id', 
            'nom', 
            'description', 
            'prix_saison_seche',
            'prix_saison_pluies',
            'image',
            'stock',
            'prix_actuel',
            'image_url',
        )

    def get_prix_actuel(self, produit):
        """Retourne le prix calculé basé sur la saison actuelle."""
        return get_prix_actuel(produit)

    def get_image_url(self, produit):
        """
        Construit l'URL complète pour l'image en utilisant le chemin du fichier média.
        """
        if produit.image and hasattr(produit.image, 'url'):
            if self.context.get('request'):
                return self.context['request'].build_absolute_uri(produit.image.url)
            return produit.image.url
        
        return 'https://placehold.co/400x200/4c3c3a/ffffff?text=Image+Manquante'


class DetailsPanierSerializer(serializers.ModelSerializer):
    produit = ProduitSerializer(read_only=True) 
    
    sous_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Details_panier
        fields = ('id', 'produit', 'quantite', 'sous_total')

    def get_sous_total(self, details_panier):
        prix_unitaire = get_prix_actuel(details_panier.produit) 
        return prix_unitaire * details_panier.quantite
