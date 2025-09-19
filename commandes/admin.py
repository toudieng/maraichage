from django.contrib import admin
from .models import Panier, Details_panier, Commande, Details_commande

admin.site.register(Panier)
admin.site.register(Details_panier)
admin.site.register(Commande)
admin.site.register(Details_commande)
