from django.shortcuts import render
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Panier, Details_panier, Produit, Commande, Details_commande
from produits.utils import get_prix_actuel
from django.db import transaction
from django.urls import reverse
import requests
import json
from maraichage_ecommerce.paydunya_config import (
    PAYDUNYA_MASTER_KEY, PAYDUNYA_PRIVATE_KEY, PAYDUNYA_TOKEN, PAYDUNYA_API_URL
)

@login_required
def ajouter_au_panier(request, produit_id):
    produit = get_object_or_404(Produit, id=produit_id)
    
    panier, created = Panier.objects.get_or_create(utilisateur=request.user)

    details_panier, created = Details_panier.objects.get_or_create(
        panier=panier,
        produit=produit,
        defaults={'quantite': 1}
    )

    if not created:
        details_panier.quantite += 1
        details_panier.save()

    return redirect('liste_produits')


@login_required
def voir_panier(request):
    try:
        panier = Panier.objects.get(utilisateur=request.user)
    except Panier.DoesNotExist:
        panier = None

    if request.method == 'POST' and panier:
        item_id = request.POST.get('item_id')
        action = request.POST.get('action')
        
        details_panier = get_object_or_404(Details_panier, id=item_id, panier=panier)
        
        if action == 'supprimer':
            details_panier.delete()
        elif action == 'mettre_a_jour':
            try:
                nouvelle_quantite = int(request.POST.get('quantite', 1))
                if nouvelle_quantite > 0:
                    details_panier.quantite = nouvelle_quantite
                    details_panier.save()
            except (ValueError, TypeError):
                pass

        return redirect('voir_panier')

    details_du_panier = []
    total = 0
    if panier:
        details_du_panier_query = Details_panier.objects.filter(panier=panier)
        for item in details_du_panier_query:
            item.prix_unitaire_actuel = get_prix_actuel(item.produit)
            item.prix_total_item = item.prix_unitaire_actuel * item.quantite
            total += item.prix_total_item
            details_du_panier.append(item)

    context = {
        'details_du_panier': details_du_panier,
        'total': total,
    }
    return render(request, 'panier.html', context)

#Qui marche très bien
# @login_required
# def passer_commande(request):
#     try:
#         panier = Panier.objects.get(utilisateur=request.user)
#         details_du_panier = Details_panier.objects.filter(panier=panier)
#     except Panier.DoesNotExist:
#         return redirect('liste_produits')

#     if not details_du_panier:
#         return redirect('liste_produits')

#     total = 0
#     items_for_paydunya = []

#     for item in details_du_panier:
#         item.prix_unitaire_actuel = get_prix_actuel(item.produit)
#         item.prix_total_item = item.prix_unitaire_actuel * item.quantite
#         total += item.prix_total_item

#         items_for_paydunya.append({
#             "name": item.produit.nom,
#             "quantity": item.quantite,
#             "unit_price": float(item.prix_unitaire_actuel),
#             "total_price": float(item.prix_total_item),
#             "description": item.produit.description,
#         })

#     if request.method == 'POST':
#         headers = {
#             'Content-Type': 'application/json',
#             'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
#             'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
#             'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
#         }

#         payload = {
#             "store": {
#                 "name": "Maraîchage Ecommerce",
#                 "tagline": "Fruits et légumes frais",
#                 "phone": "221770000000",
#                 "postal_address": "Dakar, Sénégal",
#                 "website_url": request.build_absolute_uri("/"),
#             },
#             "invoice": {
#                 "items": items_for_paydunya,
#                 "total_amount": float(total),
#                 "description": "Paiement pour votre commande maraîchère",
#             },
#             "actions": {
#                 "cancel_url": request.build_absolute_uri(reverse('voir_panier')),
#                 "return_url": request.build_absolute_uri(reverse('confirmation_paiement')),
#             },
#         }

#         try:
#             response = requests.post(
#                 f'{PAYDUNYA_API_URL}checkout-invoice/create',
#                 headers=headers,
#                 data=json.dumps(payload)
#             )

#             print("Réponse brute PayDunya:", response.text)  # debug
#             response_data = response.json()
#             print("JSON parsé PayDunya:", response_data)     # debug

#             if response_data.get('response_code') == '00':
#                 token = response_data.get('token')
#                 # sandbox: URL est dans response_text, prod: dans checkout_url
#                 checkout_url = response_data.get('checkout_url') or response_data.get('response_text')

#                 if token and checkout_url:
#                     request.session['paydunya_invoice_token'] = token
#                     return redirect(checkout_url)
#                 else:
#                     print("⚠️ Réponse incomplète de PayDunya:", response_data)
#                     return render(request, 'echec_paiement.html', {"erreur": response_data})
#             else:
#                 print("⚠️ Erreur PayDunya:", response_data)
#                 return render(request, 'echec_paiement.html', {"erreur": response_data})

#         except requests.exceptions.RequestException as e:
#             print(f"Erreur de connexion Paydunya: {e}")
#             return render(request, 'echec_paiement.html', {"erreur": str(e)})

#     context = {
#         'details_du_panier': details_du_panier,
#         'total': total,
#     }
#     return render(request, 'passer_commande.html', context)


@login_required
def passer_commande(request):
    try:
        panier = Panier.objects.get(utilisateur=request.user)
        details_du_panier = Details_panier.objects.filter(panier=panier)
    except Panier.DoesNotExist:
        return redirect('voir_panier')

    if not details_du_panier:
        return redirect('voir_panier')

    total = 0
    items_for_paydunya = []

    for item in details_du_panier:
        item.prix_unitaire_actuel = get_prix_actuel(item.produit)
        item.prix_total_item = item.prix_unitaire_actuel * item.quantite
        total += item.prix_total_item

        items_for_paydunya.append({
            "name": item.produit.nom,
            "quantity": item.quantite,
            "unit_price": float(item.prix_unitaire_actuel),
            "total_price": float(item.prix_total_item),
            "description": item.produit.description,
        })

    # Création de la commande avec statut en attente
    with transaction.atomic():
        commande = Commande.objects.create(
            utilisateur=request.user,
            total_prix=total,
            statut='en_attente'
        )

    for item in details_du_panier:
        Details_commande.objects.create(
            commande=commande,
            produit=item.produit,
            prix_unitaire=item.prix_unitaire_actuel,
            quantite=item.quantite
        )

    headers = {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
    }

    payload = {
        "store": {
            "name": "Maraîchage Ecommerce",
            "tagline": "Fruits et légumes frais",
            "phone": "221770000000",
            "postal_address": "Dakar, Sénégal",
            "website_url": request.build_absolute_uri("/"),
        },
        "invoice": {
            "items": items_for_paydunya,
            "total_amount": float(total),
            "description": f"Commande #{commande.id} - Maraîchage Ecommerce",
        },
        "actions": {
            "cancel_url": request.build_absolute_uri(reverse('voir_panier')),
            # Le return_url sera mis à jour après réception du token
            "return_url": "",  # temporaire
        },
    }

    try:
        response = requests.post(
            f'{PAYDUNYA_API_URL}checkout-invoice/create',
            headers=headers,
            data=json.dumps(payload)
        )
        response_data = response.json()

        if response_data.get('response_code') == '00':
            token = response_data.get('token')
            checkout_url = response_data.get('checkout_url') or response_data.get('response_text')

            if token and checkout_url:
                commande.transaction_id = token
                commande.save()

                # Construction du return_url après réception du token
                return_url = request.build_absolute_uri(
                    reverse('paiement_success') + f"?token={token}&commande_id={commande.id}"
                )

                # Mise à jour du payload avec le bon return_url
                payload["actions"]["return_url"] = return_url

                # Optionnel : log pour debug
                print("✅ URL de retour PayDunya :", return_url)

                return redirect(checkout_url)
            else:
                print("⚠️ Réponse incomplète de PayDunya:", response_data)
                return render(request, 'echec_paiement.html', {"erreur": response_data})
        else:
            print("⚠️ Erreur PayDunya:", response_data)
            return render(request, 'echec_paiement.html', {"erreur": response_data})

    except requests.exceptions.RequestException as e:
        print(f"Erreur de connexion Paydunya: {e}")
        return render(request, 'echec_paiement.html', {"erreur": str(e)})


@login_required
def paiement_success(request):
    token = request.GET.get("token")
    commande_id = request.GET.get("commande_id")

    if not commande_id or not token:
        return redirect('echec_paiement')

    try:
        commande = get_object_or_404(Commande, id=int(commande_id), utilisateur=request.user)
    except ValueError:
        return redirect('echec_paiement')

    headers = {
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
    }

    try:
        response = requests.get(
            f'{PAYDUNYA_API_URL}checkout-invoice/verify/{commande.transaction_id}',
            headers=headers
        )
        response_data = response.json()

        if response_data.get("status") == "completed":
            with transaction.atomic():
                commande.statut = 'validée'
                commande.save()

                try:
                    panier = Panier.objects.get(utilisateur=request.user)
                    panier.delete()
                except Panier.DoesNotExist:
                    pass

            return render(request, 'confirmation_commande.html', {
                'commande': commande,
                'paiement_ok': True
            })

        else:
            commande.statut = 'annulee'
            commande.save()
            try:
                panier = Panier.objects.get(utilisateur=request.user)
                panier.delete()
            except Panier.DoesNotExist:
                pass
            return render(request, 'echec_paiement.html', {"erreur": "Paiement non confirmé."})

    except Exception as e:
        commande.statut = 'annulee'
        commande.save()
        return render(request, 'echec_paiement.html', {"erreur": str(e)})

@login_required
def confirmation_commande(request, commande_id):
    commande = get_object_or_404(Commande, id=commande_id, utilisateur=request.user)
    context = {'commande': commande}
    return render(request, 'confirmation_commande.html', context)


@login_required
def confirmation_commande_paydunya(request):
    invoice_token = request.GET.get('invoice_token') or request.GET.get('token') or request.session.get('paydunya_invoice_token')


    if not invoice_token:
        invoice_token = request.session.pop('paydunya_invoice_token', None)

    if not invoice_token:
        return redirect('echec_paiement')
    
    # Utilisez ce token pour vérifier le statut de la facture auprès de l'API de Paydunya
    headers = {
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
    }

    try:
        response = requests.get(
            f'{PAYDUNYA_API_URL}checkout-invoice/verify/{invoice_token}',
            headers=headers
        )
        if response.status_code != 200:
            print(f"Réponse HTTP inattendue: {response.status_code}")
            return redirect('echec_paiement')

        response_data = response.json()

        # Vérification du statut de la transaction
        if response_data.get('response_code') == '00' and response_data.get('status') == 'completed':
            with transaction.atomic():
                panier = Panier.objects.get(utilisateur=request.user)
                details_du_panier = Details_panier.objects.filter(panier=panier)
                
                commande = Commande.objects.create(
                    utilisateur=request.user,
                    total_prix=response_data['total_amount'],
                    statut='Validée'
                )
                
                for item in details_du_panier:
                    Details_commande.objects.create(
                        commande=commande,
                        produit=item.produit,
                        prix_unitaire=get_prix_actuel(item.produit),
                        quantite=item.quantite
                    )
                
                panier.delete()
                
            return render(request, 'confirmation_commande.html', {'commande': commande})
        else:
            print(f"Échec de la vérification Paydunya: {response_data}")
            return redirect('echec_paiement')

    except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
        print(f"Erreur lors de la vérification du paiement: {e}")
        return redirect('echec_paiement')


def paydunya_webhook(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        invoice_token = data.get('invoice_token')
        
        # Logique pour vérifier et traiter le webhook
        # Vous devriez utiliser une logique de sécurité pour valider la requête ici.
        
        # Pour le moment, renvoyons une réponse de succès
        return JsonResponse({"status": "success"})

    return JsonResponse({"status": "failed"})

def echec_paiement(request):
    """
    Vue pour afficher une page en cas d'échec de paiement.
    """
    return render(request, 'echec_paiement.html')
