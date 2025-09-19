from django.db import models


class Categorie(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom


class Produit(models.Model):
    nom = models.CharField(max_length=200)
    description = models.TextField()
    prix_saison_seche = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    prix_saison_pluies = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    image = models.ImageField(upload_to='produits/', blank=True, null=True)
    stock = models.IntegerField()
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE)

    def __str__(self):
        return self.nom

