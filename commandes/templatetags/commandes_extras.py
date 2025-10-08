# commandes/templatetags/commandes_extras.py

from django import template

register = template.Library()

@register.filter
def multiply(value, arg):
    """Multiplie l'argument par la valeur"""
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return ''