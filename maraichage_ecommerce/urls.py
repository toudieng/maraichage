from django.contrib import admin
from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('produits/', include('produits.urls')),
    path('commandes/', include('commandes.urls')),

    # URL pour la connexion et la déconnexion
    path('connexion/', auth_views.LoginView.as_view(template_name='connexion.html'), name='login'),
    path('deconnexion/', auth_views.LogoutView.as_view(), name='logout'),
]
