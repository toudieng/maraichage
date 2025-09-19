from django.db import models
from django.contrib.auth.models import AbstractUser

class Utilisateur(AbstractUser):
    role = models.CharField(max_length=50, default='client')
    telephone = models.CharField(max_length=20, null=True, blank=True)
    adresse = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username
