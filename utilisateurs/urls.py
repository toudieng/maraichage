from django.urls import path, include
from . import views
from . import api_urls

urlpatterns = [
    path('profil/', views.profil, name='profil'),
    path('compte/', views.hub_compte, name='hub_compte'),
    path('api/', include(api_urls)),
]