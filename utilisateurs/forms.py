from django.contrib.auth.forms import UserCreationForm
from .models import Utilisateur
from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

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


class UtilisateurUpdateForm(forms.ModelForm):
    # Les champs par défaut que vous voulez modifier
    email = forms.EmailField() 
    
    class Meta:
        model = Utilisateur
        fields = [
            'username', 
            'email', 
            'first_name', 
            'last_name',
            
            # 🚨 Champs étendus 🚨
            'telephone', 
            'adresse'
        ]
        # Optionnel: Vous pouvez ajouter des widgets pour la mise en forme (ex: Bootstrap)
        widgets = {
            'adresse': forms.Textarea(attrs={'rows': 3}),
        }


class StaffUserCreationForm(UserCreationForm):
    # Ajoutez le champ 'role' en le définissant explicitement
    role = forms.ChoiceField(
        choices=Utilisateur.ROLE_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'}),
        initial=Utilisateur.CLIENT # Rôle par défaut si non spécifié
    )
    
    # Ajoutez le champ 'is_staff' pour donner l'accès à l'espace pro
    is_staff = forms.BooleanField(
        label="Accès à l'espace PRO (Staff/Livreur)",
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )

    class Meta(UserCreationForm.Meta):
        model = Utilisateur
        fields = (
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            # Les champs de mot de passe sont hérités de UserCreationForm.Meta.fields
        )

    # Surcharge de __init__ pour ajouter les classes Bootstrap aux champs restants
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # 📌 CORRECTION DE L'ERREUR DE MOT DE PASSE :
        # On itère sur les champs pour appliquer 'form-control',
        # MAIS on exclut explicitement les champs de mot de passe pour éviter un conflit d'initialisation.
        for name, field in self.fields.items():
            
            # Exclure les champs de mot de passe de la boucle d'application de classe
            if name in ['password', 'password2']: 
                continue
                
            # Appliquer 'form-control' aux champs de texte/email (méthode générique)
            if isinstance(field.widget, (forms.TextInput, forms.EmailInput)):
                field.widget.attrs.update({'class': 'form-control'})
                
            # Appliquer 'form-select' spécifiquement au champ 'role'
            if name == 'role':
                 field.widget.attrs.update({'class': 'form-select'})
    
    # Surcharge de la méthode save() pour gérer is_staff en fonction du rôle
    def save(self, commit=True):
        user = super().save(commit=False)

        # ✅ On récupère le rôle choisi dans le formulaire
        user.role = self.cleaned_data.get('role')

        # ✅ Gestion du statut staff selon le rôle
        if user.role in [Utilisateur.ADMINISTRATEUR, Utilisateur.LIVREUR]:
            user.is_staff = True
        else:
            user.is_staff = self.cleaned_data.get('is_staff', False)

        if commit:
            user.save()
        return user