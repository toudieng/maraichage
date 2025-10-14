from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

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
