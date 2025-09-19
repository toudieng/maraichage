from django.shortcuts import render

# =============================================================
# VUES D'AUTHENTIFICATION ET DE BASE
# =============================================================

def auth_view(request):
    login_form = LoginForm()
    register_form = RegisterForm()

    if request.method == 'POST':
        if 'login' in request.POST:
            login_form = LoginForm(request, data=request.POST)

            if login_form.is_valid():
                user = login_form.get_user()
                login(request, user)

                messages.success(request, f"Bienvenue, {user.username} !")

                role = user.role
                if role == 'Administrateur':
                    return redirect('admin_dashboard')
                elif role == 'Client':
                    return redirect('client')
                elif role == 'Serveur':
                    return redirect('serveur')
                elif role == 'Cuisinier':
                    return redirect('cuisinier_dashboard')
                elif role == 'Caissier':
                    return redirect('commandes_a_valider')
                elif role == 'Livreur':
                    return redirect('livreur')
                else:
                    return redirect('accueil')
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")

        elif 'register' in request.POST:
            register_form = RegisterForm(request.POST)
            if register_form.is_valid():
                user = register_form.save()
                login(request, user)
                messages.success(request, "Inscription réussie. Vous êtes maintenant connecté.")

                role = user.role
                # if role == 'Administrateur':
                #     return redirect('liste_reservations_admin')
                if role == 'Administrateur':
                    return redirect('admin_dashboard')
                elif role == 'Client':
                    return redirect('client')
                elif role == 'Serveur':
                    return redirect('serveur')
                elif role == 'Cuisinier':
                    return redirect('cuisinier_dashboard')
                elif role == 'Caissier':
                    return redirect('commandes_a_valider')
                elif role == 'Livreur':
                    return redirect('livreur')
                else:
                    return redirect('accueil')
            else:
                messages.error(request, "Erreur lors de l'inscription. Veuillez corriger les erreurs.")
                

    return render(request, 'authentification/connexion.html', {
        'login_form': login_form,
        'register_form': register_form,
    })

def logout_view(request):
    auth_logout(request)
    messages.success(request, "Déconnexion réussie.")
    return redirect('connexion')
