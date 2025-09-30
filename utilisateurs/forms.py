from django.contrib.auth.forms import UserCreationForm
from .models import Utilisateur
from django import forms

class InscriptionForm(UserCreationForm):
    
    telephone = forms.CharField(
        max_length=20, 
        required=False, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Téléphone (optionnel)'})
    )
    adresse = forms.CharField(
        max_length=255, 
        required=False, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Adresse (optionnel)'})
    )
    
    class Meta(UserCreationForm.Meta):
        model = Utilisateur
        # Suppression de 'role' de la liste des champs affichés
        fields = UserCreationForm.Meta.fields + ('email', 'telephone', 'adresse')
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Ajout des classes Bootstrap aux champs
        for field_name in self.fields:
            self.fields[field_name].widget.attrs.update({'class': 'form-control'})
                
        # Assurez-vous que l'email est requis
        if 'email' in self.fields:
             self.fields['email'].required = True

    # NOUVEAU : Surcharge de la méthode save() pour définir le rôle
    def save(self, commit=True):
        # Appelle la méthode save du parent (UserCreationForm)
        user = super().save(commit=False)
        
        # Définition automatique du rôle à 'Client'
        user.role = Utilisateur.CLIENT 
        
        if commit:
            user.save()
        return user