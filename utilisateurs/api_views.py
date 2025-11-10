from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_POST
import json

User = get_user_model()


@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        data = request.POST
        username = data.get('username')
        password = data.get('password')

        print(f"🔐 Tentative de connexion : {username}")  # Debug

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

            # ✅ Logs de débogage
            print(f"✅ Connexion réussie : {user.username}")
            print(f"🍪 Session key : {request.session.session_key}")
            print(f"🍪 Is authenticated : {request.user.is_authenticated}")
            
            return JsonResponse({
                'success': True,
                'authenticated': True,
                'username': user.username,
                'email': user.email,
                'telephone': getattr(user, 'telephone', ''),
                'nom_complet': user.get_full_name(),
            })

            # ✅ Log du cookie dans la réponse
            print(f"🍪 Cookies in response : {response.cookies}")
            
            return response

        else:
            print("❌ Authentification échouée")
            return JsonResponse({'success': False, 'error': 'Identifiants incorrects'}, status=401)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


# @csrf_exempt
# def api_login(request):
#     if request.method == 'POST':
#         data = request.POST
#         username = data.get('username')
#         password = data.get('password')
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             return JsonResponse({'success': True, 'message': f'Bienvenue {user.username}'})
#         else:
#             return JsonResponse({'success': False, 'error': 'Identifiants incorrects'}, status=401)
#     return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@csrf_exempt
def api_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Format de requête JSON invalide'}, status=400)

    username = data.get('username')
    email = data.get('email')
    password1 = data.get('password1')
    password2 = data.get('password2')

    # Validation des champs
    if not all([username, email, password1, password2]):
        return JsonResponse({'error': 'Tous les champs sont requis'}, status=400)

    if password1 != password2:
        return JsonResponse({'error': 'Les mots de passe ne correspondent pas'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Ce nom d’utilisateur est déjà pris'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Cet email est déjà utilisé'}, status=400)

    # Création de l'utilisateur
    user = User.objects.create_user(username=username, email=email, password=password1)
    login(request, user)

    return JsonResponse({'success': True})

# @csrf_exempt
# def api_register(request):
#     if request.method != 'POST':
#         return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#     username = request.POST.get('username')
#     email = request.POST.get('email')
#     password1 = request.POST.get('password1')
#     password2 = request.POST.get('password2')

#     if not all([username, email, password1, password2]):
#         return JsonResponse({'error': 'Tous les champs sont requis'}, status=400)

#     if password1 != password2:
#         return JsonResponse({'error': 'Les mots de passe ne correspondent pas'}, status=400)

#     if User.objects.filter(username=username).exists():
#         return JsonResponse({'error': 'Ce nom d’utilisateur est déjà pris'}, status=400)

#     if User.objects.filter(email=email).exists():
#         return JsonResponse({'error': 'Cet email est déjà utilisé'}, status=400)

#     user = User.objects.create_user(username=username, email=email, password=password1)
#     login(request, user)

#     return JsonResponse({'success': True})


@csrf_exempt
def api_logout(request):
    if request.method == 'POST':
        logout(request)
        response = JsonResponse({'success': True})
        response.delete_cookie('sessionid')
        return response
        # return JsonResponse({'success': True})
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

def api_user_info(request):
    # ✅ Ne plus utiliser @login_required, gérer manuellement l'authentification
    if not request.user.is_authenticated:
        return JsonResponse({
            'authenticated': False,
            'username': 'Mon Compte'  # Valeur par défaut
        })

    user = request.user
    return JsonResponse({
        'authenticated': True,
        'username': user.username,
        'email': user.email,
        'telephone': getattr(user, 'telephone', ''),
        'nom_complet': user.get_full_name(),
    })

# @login_required
# def api_user_info(request):
#     if not request.user.is_authenticated:
#         return JsonResponse({
#             'authenticated': False,
#             'username': None
#         })

#     user = request.user
#     return JsonResponse({
#         'authenticated': True,
#         'username': user.username,
#         'email': user.email,
#         'telephone': getattr(user, 'telephone', ''),
#         'nom_complet': user.get_full_name(),
#     })

@require_POST
@login_required
def api_profil_update(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Données JSON invalides.'}, status=400)

    user = request.user
    
    if 'nom_complet' in data:
        user.first_name = data.get('nom_complet', '').split(' ')[0] if data.get('nom_complet') else user.first_name
        user.last_name = ' '.join(data.get('nom_complet', '').split(' ')[1:]) if len(data.get('nom_complet', '').split(' ')) > 1 else user.last_name
    
    if 'email' in data:
        user.email = data['email']
        
    if hasattr(user, 'telephone') and 'telephone' in data:
        setattr(user, 'telephone', data['telephone'])

    try:
        user.save()
        return JsonResponse({'message': 'Profil mis à jour avec succès.'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)