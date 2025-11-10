from django.shortcuts import render, redirect
from django.contrib.auth import login, logout as auth_logout # Renomme logout pour éviter les conflits
from django.contrib import messages # IMPORTANT : Assurez-vous d'importer les messages
from django.contrib.auth.forms import AuthenticationForm 
from .forms import InscriptionForm 
from django.contrib.auth.decorators import login_required
from .forms import UtilisateurUpdateForm
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import get_user_model
from .models import Utilisateur
from .forms import StaffUserCreationForm
from .forms import UtilisateurUpdateForm

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


User = get_user_model() 

def is_gestionnaire(user):
    # On utilise is_staff ou is_superuser pour déterminer l'accès à la gestion Pro
    return user.is_active and (user.is_staff or user.is_superuser)


# 1. Vue Liste (Maintenant liste TOUS les utilisateurs actifs)
@login_required
@user_passes_test(is_gestionnaire)
def tableau_bord_utilisateurs(request):
    """
    Liste tous les utilisateurs actifs.
    """
    # Liste tous les utilisateurs actifs, triés par rôle Admin/Staff d'abord
    utilisateurs_qs = Utilisateur.objects.filter(is_active=True).order_by('-is_superuser', '-is_staff', 'username')
    
    context = {
        'utilisateurs_qs': utilisateurs_qs,
        'is_admin': request.user.is_superuser,
    }
    
    return render(request, 'utilisateurs/tableau_bord_utilisateurs.html', context)


# 2. Vue Ajouter un Utilisateur
@login_required
@user_passes_test(lambda u: u.is_superuser) # Seul un Superuser peut créer
def ajouter_utilisateur(request):
    # Nous utilisons StaffUserCreationForm pour gérer la création du mot de passe
    if request.method == 'POST':
        form = StaffUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # 🚨 Si votre StaffUserCreationForm ne gère pas le champ 'role',
            # vous devrez le définir ici manuellement si vous voulez qu'il ne soit pas 'Client'.
            # Exemple: user.role = Utilisateur.ADMINISTRATEUR si c'est un Admin créé.
            
            messages.success(request, f"L'utilisateur **{user.username}** a été créé avec succès.")
            return redirect('tableau_bord_utilisateurs')
        else:
            messages.error(request, "Erreur lors de la création de l'utilisateur. Vérifiez les champs.")
    else:
        form = StaffUserCreationForm()
        
    context = {'form': form, 'page_title': "Ajouter un Utilisateur"}
    return render(request, 'utilisateurs/ajouter_utilisateur.html', context)


# 3. Vue Modifier (Rôle et Infos basiques)
@login_required
@user_passes_test(lambda u: u.is_superuser)
def modifier_utilisateur(request, user_id):
    user_a_modifier = get_object_or_404(Utilisateur, pk=user_id)
    
    # Empêcher l'édition de son propre rôle/statut
    if user_a_modifier.pk == request.user.pk:
        messages.error(request, "Vous ne pouvez pas modifier vos propres droits ou profil depuis cette interface.")
        return redirect('tableau_bord_utilisateurs') 
    
    if request.method == 'POST':
        # Utilisez UtilisateurUpdateForm pour les champs étendus (téléphone, adresse, email...)
        form = UtilisateurUpdateForm(request.POST, instance=user_a_modifier)
        
        # Logique pour les booléens (is_staff, is_superuser) et le champ role (s'ils sont inclus dans le formulaire)
        if form.is_valid():
            user = form.save(commit=False)
            
            # Logique spécifique aux rôles
            role_choisi = request.POST.get('role')
            if role_choisi in [r[0] for r in Utilisateur.ROLE_CHOICES]:
                user.role = role_choisi
                
            # Logique is_staff/is_superuser
            user.is_staff = request.POST.get('is_staff') == 'on'
            user.is_superuser = request.POST.get('is_superuser') == 'on'

            user.save()
            messages.success(request, f"L'utilisateur **{user.username}** a été mis à jour.")
            return redirect('tableau_bord_utilisateurs')
    else:
        form = UtilisateurUpdateForm(instance=user_a_modifier)

    context = {
        'form': form,
        'user_a_modifier': user_a_modifier,
    }
    
    return render(request, 'utilisateurs/modifier_utilisateur.html', context)


# 4. Vue Supprimer (Désactiver)
@login_required
@user_passes_test(lambda u: u.is_superuser)
def supprimer_utilisateur(request, user_id):
    user_a_supprimer = get_object_or_404(Utilisateur, id=user_id)
    
    if user_a_supprimer == request.user:
        messages.error(request, "Vous ne pouvez pas désactiver votre propre compte.")
        return redirect('tableau_bord_utilisateurs')
        
    if request.method == 'POST':
        user_a_supprimer.is_active = False # Désactivation logique
        user_a_supprimer.save()
        messages.warning(request, f"L'utilisateur **{user_a_supprimer.username}** a été désactivé.")
        return redirect('tableau_bord_utilisateurs')
        
    context = {
        'user_a_supprimer': user_a_supprimer
    }
    # Assurez-vous d'avoir ce template : utilisateurs/confirmer_suppression.html
    return render(request, 'utilisateurs/confirmer_suppression.html', context)
# 3. Vue pour Supprimer (Désactiver) un Utilisateur
@login_required
@user_passes_test(lambda u: u.is_superuser)
def supprimer_utilisateur(request, user_id):
    user_a_supprimer = get_object_or_404(User, id=user_id)
    
    # Empêcher la suppression de son propre compte
    if user_a_supprimer == request.user:
        messages.error(request, "Opération non autorisée.")
        return redirect('tableau_bord_utilisateurs')
        
    if request.method == 'POST':
        # Bonne pratique: on désactive (suppression logique) plutôt que de supprimer définitivement
        user_a_supprimer.is_active = False 
        user_a_supprimer.save()
        messages.success(request, f"L'utilisateur {user_a_supprimer.username} a été désactivé.")
        return redirect('tableau_bord_utilisateurs')
        
    context = {
        'user_a_supprimer': user_a_supprimer
    }
    return render(request, 'utilisateurs/confirmer_suppression.html', context)