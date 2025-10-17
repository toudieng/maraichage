from django.db import models
from utilisateurs.models import Utilisateur
from produits.models import Produit

class Panier(models.Model):
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
    date_creation = models.DateTimeField(auto_now_add=True)

class Details_panier(models.Model):
    panier = models.ForeignKey(Panier, on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    quantite = models.IntegerField(default=1)

MODE_PAIEMENT_CHOICES = [
    ('paydunya', 'PayDunya (Wave, Orange, Carte)'),
    ('livraison', 'Paiement à la livraison'),
]


class Commande(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    date_commande = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=50, default='en cours')
    total_prix = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    adresse_livraison = models.CharField(max_length=255, null=True, blank=True)
    telephone_livraison = models.CharField(max_length=20, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)


    mode_paiement = models.CharField(
        max_length=50, 
        choices=MODE_PAIEMENT_CHOICES, 
        default='paydunya'
    )

    STATUT_CHOICES = [
        ('en_attente', 'En attente de paiement'),
        ('validée', 'Validée et en préparation'),
        ('annulee', 'Annulée'),
        ('livree', 'Livrée'),
    ]

    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente' # Valeur par défaut
    )

class Details_commande(models.Model):
    commande = models.ForeignKey(Commande, on_delete=models.CASCADE)
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    quantite = models.IntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
