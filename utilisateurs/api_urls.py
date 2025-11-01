from django.urls import path
from .api_views import api_login, api_user_info, api_register, api_logout, api_profil_update

urlpatterns = [
    path('login/', api_login),
    path('register/', api_register, name='api_register'),
    path('logout/', api_logout, name='api_logout'),
    path('user/', api_user_info, name='api_user_info'),
    path('profil/', api_profil_update, name='api_profil_update'),
]