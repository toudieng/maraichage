from django.urls import path
from .api_views import api_login

urlpatterns = [
    path('login/', api_login),
]