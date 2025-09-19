import datetime

def get_prix_actuel(produit):
    aujourdhui = datetime.date.today()
    mois_actuel = aujourdhui.month
    jour_actuel = aujourdhui.day

    is_saison_pluies = False
    if mois_actuel > 5 and mois_actuel < 9:
        is_saison_pluies = True
    elif mois_actuel == 5 and jour_actuel >= 15:
        is_saison_pluies = True
    elif mois_actuel == 9 and jour_actuel <= 15:
        is_saison_pluies = True

    if is_saison_pluies:
        return produit.prix_saison_pluies
    else:
        return produit.prix_saison_seche