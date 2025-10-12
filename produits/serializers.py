from rest_framework import serializers
from .models import Produit
from .utils import get_prix_actuel 

class ProduitSerializer(serializers.ModelSerializer):
    # Champ calculé pour obtenir le prix en fonction de la saison
    prix_actuel = serializers.SerializerMethodField()
    # NOUVEAU : Champ calculé pour construire l'URL complète de l'image
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Produit
        fields = (
            'id', 
            'nom', 
            'description', 
            'prix_saison_seche',
            'prix_saison_pluies',
            'image', # Le champ original pour référence
            'prix_actuel', # Champ calculé
            'image_url', # Champ calculé pour le frontend
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
                # Ceci construit l'URL complète, ex: http://localhost:8000/media/produits/carotte.jpg
                return self.context['request'].build_absolute_uri(produit.image.url)
            # Solution de secours sans la requête (moins fiable)
            return produit.image.url
        
        return 'https://placehold.co/400x200/4c3c3a/ffffff?text=Image+Manquante'
