from django.urls import path
from .api_views import api_login, api_user_info

urlpatterns = [
    path('login/', api_login),
    path('user/', api_user_info, name='api_user_info'),
]