from django.shortcuts import render, redirect
from django.contrib.auth import login, logout as auth_logout # Renomme logout pour éviter les conflits
from django.contrib import messages # IMPORTANT : Assurez-vous d'importer les messages
from django.contrib.auth.forms import AuthenticationForm 
# Assurez-vous que InscriptionForm est dans utilisateurs/forms.py
from .forms import InscriptionForm 


# =============================================================
# VUE UNIQUE POUR CONNEXION ET INSCRIPTION (fusion de auth_view et connexion_inscription)
# =============================================================

def connexion_inscription(request):
    # Initialisation des formulaires pour le rendu GET ou en cas d'erreur
    login_form = AuthenticationForm()
    register_form = InscriptionForm()

    if request.method == 'POST':
        
        # --- 1. Tentative de CONNEXION ---
        if 'login' in request.POST:
            # Note: AuthenticationForm doit être instancié avec 'request' pour la session/authentification
            login_form = AuthenticationForm(request, data=request.POST) 
            
            if login_form.is_valid():
                user = login_form.get_user()
                login(request, user)
                messages.success(request, f"Bienvenue, {user.username} ! Vous êtes connecté en tant que {user.role}.")
                
                # La vérification du rôle DOIT rester ici pour les administrateurs existants
                if user.role == 'Administrateur':
                    return redirect('admin_dashboard') 
                
                return redirect('home') 
            
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
                
        # --- 2. Tentative d'INSCRIPTION ---
        elif 'register' in request.POST:
            register_form = InscriptionForm(request.POST)
            
            if register_form.is_valid():
                user = register_form.save()
                login(request, user)
                messages.success(request, "Inscription réussie. Vous êtes maintenant connecté.")
                
                # Simplification : Le rôle est toujours 'Client' ici, donc on redirige directement vers 'home'
                return redirect('home') 
            
            else:
                messages.error(request, "Erreur lors de l'inscription. Veuillez corriger les erreurs.")
                
    # Rendu du template. IMPORTANT : utilise 'form' pour la connexion, comme dans votre template corrigé
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