from django import forms
from utilisateurs.models import Utilisateur
from .models import Commande, MODE_PAIEMENT_CHOICES
from django.forms.widgets import Textarea


MODE_PAIEMENT_CHOICES = (
    ('', '--- Choisissez un mode de paiement ---'),
    ('paiement_livraison', 'Paiement à la livraison'),
    ('wave', 'Wave'),
    ('orange_money', 'Orange Money'),
    ('carte_bancaire', 'Carte Bancaire (Visa/Mastercard)'),
)

class ValidationCommandeForm(forms.Form):
    
    telephone = forms.CharField(
        max_length=20, 
        label='Téléphone de Livraison',
        required=True
    )
    adresse = forms.CharField(
        widget=Textarea(attrs={'rows': 3}), # Utiliser Textarea
        label='Adresse de Livraison',
        required=True
    )

    mode_paiement = forms.ChoiceField(
        choices=MODE_PAIEMENT_CHOICES,
        label='Mode de Paiement',
        widget=forms.Select(attrs={'class': 'form-select'}) 
    )
    
    def __init__(self, *args, **kwargs):
        user_instance = kwargs.pop('instance', None) 
        super().__init__(*args, **kwargs)

        if user_instance:
            self.fields['telephone'].initial = getattr(user_instance, 'telephone', '')
            self.fields['adresse'].initial = getattr(user_instance, 'adresse', '')

class StatutCommandeForm(forms.ModelForm):
    class Meta:
        model = Commande
        # Nous incluons SEULEMENT le champ 'statut', qui contient les choix.
        fields = ['statut'] 
        widgets = {
            # Optionnel : Ajoute une classe Bootstrap pour le style
            'statut': forms.Select(attrs={'class': 'form-select form-select-sm'}),
        }