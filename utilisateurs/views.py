from django.shortcuts import render, redirect
from django.contrib.auth import login, logout as auth_logout # Renomme logout pour éviter les conflits
from django.contrib import messages # IMPORTANT : Assurez-vous d'importer les messages
from django.contrib.auth.forms import AuthenticationForm 
# Assurez-vous que InscriptionForm est dans utilisateurs/forms.py
from .forms import InscriptionForm 
from django.contrib.auth.decorators import login_required
from .forms import UtilisateurUpdateForm
from django.contrib.auth.decorators import login_required, user_passes_test


# =============================================================
# VUE UNIQUE POUR CONNEXION ET INSCRIPTION (fusion de auth_view et connexion_inscription)
# =============================================================

def connexion_inscription(request):
    login_form = AuthenticationForm(prefix='login')
    register_form = InscriptionForm(prefix='register')

    if request.method == 'POST':
        if 'login' in request.POST:
            login_form = AuthenticationForm(request, data=request.POST, prefix='login')
            if login_form.is_valid():
                user = login_form.get_user()
                login(request, user)
                messages.success(request, f"Bienvenue, {user.username} !")
                if user.role == 'Administrateur':
                    return redirect('tableau_bord_commandes')
                elif user.role == 'Livreur':
                    return redirect('tableau_de_bord_livreur')
                return redirect('home')
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
        elif 'register' in request.POST:
            register_form = InscriptionForm(request.POST, prefix='register')
            if register_form.is_valid():
                user = register_form.save()
                login(request, user)
                messages.success(request, "Inscription réussie.")
                return redirect('home')
            else:
                messages.error(request, "Erreur lors de l'inscription.")
                
    return render(request, 'authentification/connexion.html', {
        'form': login_form,
        'register_form': register_form,
    })



# =============================================================
# VUE DE DÉCONNEXION
# =============================================================

def logout_view(request):
    # Utilisation de l'alias 'auth_logout' défini dans l'import
    auth_logout(request)
    messages.success(request, "Déconnexion réussie.")
    
    # Redirige vers la page de connexion (nom 'login' dans urls.py)
    return redirect('login')


@login_required
def profil(request):
    if request.method == 'POST':
        # Instanciation du formulaire avec les données POST et l'instance d'utilisateur actuelle
        # Note: request.user est l'instance de votre modèle Utilisateur
        form = UtilisateurUpdateForm(request.POST, instance=request.user)
        
        if form.is_valid():
            form.save()
            # Utilisez le système de messages de Django pour une confirmation utilisateur
            messages.success(request, 'Votre profil a été mis à jour avec succès !')
            return redirect('profil') # Redirection vers la page profil (pattern name)
    else:
        # Instanciation du formulaire pour l'affichage (GET)
        form = UtilisateurUpdateForm(instance=request.user)

    context = {
        'form': form
    }
    return render(request, 'profil.html', context)

@login_required
def hub_compte(request):
    """
    Page d'accueil de l'espace utilisateur (Mon Compte).
    Sert de hub pour la navigation vers le profil et l'historique des commandes.
    """
    return render(request, 'hub_compte.html')



def is_livreur(user):
    # Assurez-vous que le rôle 'Livreur' est défini dans votre modèle Utilisateur
    return user.role == 'Livreur'