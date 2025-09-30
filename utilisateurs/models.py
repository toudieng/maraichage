from django.db import models
from django.contrib.auth.models import AbstractUser

class Utilisateur(AbstractUser):
    ADMINISTRATEUR = 'Administrateur'
    CLIENT = 'Client'

    ROLE_CHOICES = [
        (ADMINISTRATEUR, 'Administrateur'),
        (CLIENT, 'Client'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=CLIENT)
    telephone = models.CharField(max_length=20, null=True, blank=True)
    adresse = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username
