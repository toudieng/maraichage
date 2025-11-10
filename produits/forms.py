# produits/forms.py

from django import forms
from .models import Produit

class ProduitForm(forms.ModelForm):
    class Meta:
        model = Produit
        fields = [
            'nom', 
            'description', 
            'prix_saison_seche', 
            'prix_saison_pluies', 
            'image', 
            'stock', 
            'categorie'
        ]
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ajouter les classes Bootstrap à tous les champs
        for name, field in self.fields.items():
            if name != 'image': # L'image field est souvent gérée différemment
                field.widget.attrs.update({'class': 'form-control'})
            if name == 'description':
                 field.widget.attrs.update({'rows': '4'})