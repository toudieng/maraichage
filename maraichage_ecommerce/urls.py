# maraichage_ecommerce/urls.py

from django.contrib import admin
from django.urls import path, include
from . import views # Pour la vue 'home'
from django.contrib.auth import views as auth_views 
from utilisateurs import views as user_views # Importez les vues utilisateurs
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('produits/', include('produits.urls')),
    path('commandes/', include('commandes.urls')),
    path('utilisateurs/', include('utilisateurs.urls')), 

    # AUTHENTIFICATION
    # Les deux noms d'URL pointent vers la même vue qui gère les deux actions (Connexion ET Inscription)
    path('connexion/', user_views.connexion_inscription, name='login'),
    path('inscription/', user_views.connexion_inscription, name='register'),
    path('deconnexion/', auth_views.LogoutView.as_view(), name='logout'),
    
    # SYSTEME DE REINITIALISATION DE MOT DE PASSE
    path('mot-de-passe/reset/', 
         auth_views.PasswordResetView.as_view(template_name='authentification/reinitialisation_password.html'), 
         name='password_reset'),
    
    # ... (le reste des URLs de réinitialisation) ...
    path('mot-de-passe/reset/fait/', 
         auth_views.PasswordResetDoneView.as_view(template_name='authentification/reinitialisation_password_complet.html'), 
         name='password_reset_done'),
    
    path('mot-de-passe/reset/<uidb64>/<token>/', 
         auth_views.PasswordResetConfirmView.as_view(template_name='authentification/reinitialisation_password_confirmer.html'), 
         name='password_reset_confirm'),
    
    path('mot-de-passe/reset/termine/', 
         auth_views.PasswordResetCompleteView.as_view(template_name='authentification/reinitialisation_password_terminer.html'), 
         name='password_reset_complete'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)