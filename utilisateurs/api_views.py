from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth import get_user_model

User = get_user_model()


@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        data = request.POST
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': f'Bienvenue {user.username}'})
        else:
            return JsonResponse({'success': False, 'error': 'Identifiants incorrects'}, status=401)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def api_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

    username = request.POST.get('username')
    email = request.POST.get('email')
    password1 = request.POST.get('password1')
    password2 = request.POST.get('password2')

    if not all([username, email, password1, password2]):
        return JsonResponse({'error': 'Tous les champs sont requis'}, status=400)

    if password1 != password2:
        return JsonResponse({'error': 'Les mots de passe ne correspondent pas'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Ce nom d’utilisateur est déjà pris'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Cet email est déjà utilisé'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password1)
    login(request, user)

    return JsonResponse({'success': True})


@csrf_exempt
def api_logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@login_required
def api_user_info(request):
    user = request.user
    return JsonResponse({
        'username': user.username,
        'email': user.email,
        'telephone': getattr(user, 'telephone', ''),
        'nom_complet': user.get_full_name(),
    })

