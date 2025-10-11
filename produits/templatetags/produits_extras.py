from django import template
from ..utils import get_prix_actuel 

register = template.Library()

@register.filter
def prix_actuel(produit):
    """
    Filtre de template pour obtenir le prix actuel d'un produit en utilisant la logique saisonnière.
    Utilisation: {{ produit|prix_actuel }}
    """
    # Appel de votre fonction de logique métier
    return get_prix_actuel(produit)