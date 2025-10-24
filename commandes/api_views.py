from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from .models import Produit, Panier, Details_panier, Commande, Details_commande
from django.utils.dateformat import format as date_format
import json
from produits.utils import get_prix_actuel
from decimal import Decimal
from django.db import transaction
from django.db.models import F
from django.urls import reverse
from django.http import FileResponse
from pathlib import Path
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from maraichage_ecommerce.paydunya_sdk.checkout import CheckoutInvoice, PaydunyaSetup


#A garder, c'est sans logs
# @csrf_exempt
# @login_required
# def api_ajouter_au_panier(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             produit_id = data.get('produit_id')
#             quantite = int(data.get('quantite', 1))

#             produit = get_object_or_404(Produit, id=produit_id)
#             panier, _ = Panier.objects.get_or_create(utilisateur=request.user)
#             item, created = Details_panier.objects.get_or_create(
#                 panier=panier, produit=produit,
#                 defaults={'quantite': quantite}
#             )
#             if not created:
#                 item.quantite += quantite
#                 item.save()

#             return JsonResponse({'success': True, 'message': 'Produit ajouté au panier'})
#         except Exception as e:
#             return JsonResponse({'success': False, 'error': str(e)}, status=400)
#     return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@csrf_exempt
@login_required
def api_ajouter_au_panier(request):
    if request.method == 'POST':
        try:
            print("🔐 Utilisateur connecté :", request.user.username)
            data = json.loads(request.body)
            produit_id = data.get('produit_id')
            quantite = int(data.get('quantite', 1))
            print("📦 Produit ID reçu :", produit_id)
            print("🧮 Quantité demandée :", quantite)

            produit = get_object_or_404(Produit, id=produit_id)
            print("✅ Produit trouvé :", produit.nom)

            panier, panier_created = Panier.objects.get_or_create(utilisateur=request.user)
            print("🛒 Panier ID :", panier.id, "| Créé :", panier_created)

            item, created = Details_panier.objects.get_or_create(
                panier=panier, produit=produit,
                defaults={'quantite': quantite}
            )
            if created:
                print("🆕 Item ajouté au panier :", item.id)
            else:
                print("🔁 Item existant, mise à jour de la quantité")
                item.quantite += quantite
                item.save()
                print("✅ Nouvelle quantité :", item.quantite)

            return JsonResponse({'success': True, 'message': 'Produit ajouté au panier'})
        except Exception as e:
            print("❌ Erreur lors de l’ajout au panier :", str(e))
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    print("🚫 Méthode non autorisée :", request.method)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


# @login_required
# def api_voir_panier(request):
#     try:
#         panier = Panier.objects.get(utilisateur=request.user)
#         items = Details_panier.objects.filter(panier=panier)
#         data = []
#         for item in items:
#             prix = get_prix_actuel(item.produit)
#             data.append({
#                 'id': item.id,
#                 'produit': item.produit.nom,
#                 'quantite': item.quantite,
#                 'prix_unitaire': prix,
#                 'prix_total': prix * item.quantite,
#             })
#         return JsonResponse({'panier': data})
#     except Panier.DoesNotExist:
#         return JsonResponse({'panier': []})


@login_required
def api_voir_panier(request):
    try:
        print("🔐 Utilisateur connecté :", request.user.username)

        panier = Panier.objects.get(utilisateur=request.user)
        print("🛒 Panier trouvé :", panier.id)

        items = Details_panier.objects.filter(panier=panier)
        print("📦 Nombre d’items dans le panier :", items.count())

        data = []
        for item in items:
            prix_actuel = get_prix_actuel(item.produit)
            
            image_url = ''
            if item.produit.image and hasattr(item.produit.image, 'url'):
                # Construction de l'URL absolue pour l'image
                image_url = request.build_absolute_uri(item.produit.image.url)

            print(f"🧾 Item {item.id} | Produit : {item.produit.nom} | Quantité : {item.quantite} | Prix unitaire : {prix_actuel}")

            # 🌟 CORRECTION CLÉ : Créer un objet 'produit' complet
            data.append({
                'id': item.id,
                # L'objet 'produit' imbriqué contient le nom, le prix ACTUEL et l'URL de l'image
                'produit': { 
                    'id': item.produit.id,
                    'nom': item.produit.nom,
                    'prix_actuel': prix_actuel, # Le front-end le cherchera ici
                    'image_url': image_url,     # Le front-end le cherchera ici
                },
                
                # Ces champs sont maintenus pour la compatibilité avec votre code existant
                'quantite': item.quantite,
                'prix_unitaire': prix_actuel, # Reste pour la compatibilité
                'prix_total': prix_actuel * item.quantite, # Reste pour la compatibilité
                # 'image_url': image_url, # Supprimé car maintenant dans l'objet 'produit' (plus propre)
            })

        return JsonResponse({'panier': data})
    except Panier.DoesNotExist:
        print("⚠️ Aucun panier trouvé pour l’utilisateur :", request.user.username)
        return JsonResponse({'panier': []})

@csrf_exempt
@login_required
def api_update_panier_item(request):
    if request.method in ['POST', 'PUT', 'PATCH']:
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            nouvelle_quantite = int(data.get('quantite'))

            item = get_object_or_404(Details_panier, id=item_id, panier__utilisateur=request.user)
            item.quantite = nouvelle_quantite
            item.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
@login_required
def api_remove_panier_item(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            item = get_object_or_404(Details_panier, id=item_id, panier__utilisateur=request.user)
            item.delete()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
@login_required
def api_clear_panier(request):
    try:
        panier = Panier.objects.get(utilisateur=request.user)
        panier.details_panier_set.all().delete()
        return JsonResponse({'success': True})
    except Panier.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Panier introuvable'}, status=404)


@csrf_exempt
@login_required
def api_valider_commande(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

    try:
        data = json.loads(request.body)
        utilisateur = request.user
        telephone = data.get('telephone') or getattr(utilisateur, 'telephone', '')
        adresse = data.get('adresse') or 'Adresse non précisée'
        mode_paiement = data.get('mode_paiement') or 'paiement_livraison'
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        panier = Panier.objects.get(utilisateur=utilisateur)
        details_du_panier = Details_panier.objects.filter(panier=panier)

        if not details_du_panier.exists():
            return JsonResponse({'error': 'Panier vide'}, status=400)

        total = Decimal('0.0')
        items_for_paydunya = []

        for item in details_du_panier:
            prix = get_prix_actuel(item.produit) or Decimal('0.0')
            item.prix_unitaire_actuel = prix
            item.prix_total_item = prix * item.quantite
            total += item.prix_total_item

            items_for_paydunya.append({
                "name": item.produit.nom,
                "quantity": item.quantite,
                "unit_price": float(prix),
            })

        with transaction.atomic():
            commande = Commande.objects.create(
                utilisateur=utilisateur,
                total_prix=total,
                statut='en_attente',
                adresse_livraison=adresse,
                telephone_livraison=telephone,
                latitude=latitude,
                longitude=longitude,
                mode_paiement=mode_paiement
            )

            for item in details_du_panier:
                Details_commande.objects.create(
                    commande=commande,
                    produit=item.produit,
                    prix_unitaire=item.prix_unitaire_actuel,
                    quantite=item.quantite
                )

            # Vider le panier après validation
            details_du_panier.delete()

        return_url_final = f"http://localhost:5173/commande/{commande.id}"

        try:
            invoice = CheckoutInvoice()

            client_nom = f"{utilisateur.first_name} {utilisateur.last_name}".strip()
            if not client_nom:
                client_nom = utilisateur.username

            invoice.customer_name = client_nom
            invoice.customer_email = utilisateur.email
            invoice.customer_phone_number = telephone

            for item in items_for_paydunya:
                invoice.add_item(
                    name=item['name'],
                    quantity=item['quantity'],
                    unit_price=item['unit_price']
                )

            invoice.total_amount = float(total)
            invoice.description = f"Commande #{commande.id} - Maraîchage Ecommerce"
            invoice.return_url = return_url_final
            invoice.cancel_url = request.build_absolute_uri(reverse('voir_panier'))

            if invoice.create():
                checkout_url = invoice.url
                token = checkout_url.split('/')[-1]
                commande.transaction_id = token
                commande.save()

                return JsonResponse({'success': True, 'checkout_url': checkout_url})
            else:
                return JsonResponse({
                    'success': False,
                    'error': invoice.response_text,
                    'commande_id': commande.id
                }, status=400)

        except Exception as e:
            print(f"Erreur PayDunya : {e}")
            return JsonResponse({
                'success': False,
                'error': f"Erreur interne PayDunya : {str(e)}",
                'commande_id': commande.id
            }, status=500)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def api_commande_detail(request, id):
    commande = get_object_or_404(Commande, id=id, utilisateur=request.user)

    produits = []
    details = Details_commande.objects.filter(commande=commande)

    for item in details:
        produits.append({
            "nom": item.produit.nom,
            "quantite": item.quantite,
            "prix_unitaire": float(item.prix_unitaire),
            "prix_total": float(item.prix_unitaire * item.quantite),
        })

    client_nom = f"{commande.utilisateur.first_name} {commande.utilisateur.last_name}".strip()
    if not client_nom:
        client_nom = commande.utilisateur.username

    commande_data = {
        "id": commande.id,
        "statut": commande.statut,
        "total_prix": float(commande.total_prix),
        "adresse_livraison": commande.adresse_livraison or "",
        "telephone_livraison": commande.telephone_livraison or "",
        "latitude": commande.latitude,
        "longitude": commande.longitude,
        "mode_paiement": commande.mode_paiement,
        "date_commande": date_format(commande.date_commande, 'd/m/Y à H:i'),
        "client": client_nom,
        "produits": produits,
    }

    return JsonResponse({"commande": commande_data})

# @login_required
# def api_details_commande(request, commande_id):
#     try:
#         commande = get_object_or_404(Commande, id=commande_id, utilisateur=request.user)
#         details = Details_commande.objects.filter(commande=commande)
#         items = [{
#             'produit': d.produit.nom,
#             'quantite': d.quantite,
#             'prix_unitaire': d.prix_unitaire,
#             'prix_total': d.prix_unitaire * d.quantite
#         } for d in details]
#         return JsonResponse({
#             'commande_id': commande.id,
#             'statut': commande.statut,
#             'total': commande.total_prix,
#             'items': items
#         })
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=400)

@login_required
def api_historique_commandes(request):
    commandes = Commande.objects.filter(utilisateur=request.user).order_by('-date_commande')
    data = []
    for c in commandes:
        data.append({
            'id': c.id,
            'date': c.date_commande,
            'statut': c.statut,
            'total': c.total_prix
        })
    return JsonResponse({'commandes': data})


@csrf_exempt
def api_paydunya_webhook(request):
    if request.method != 'POST':
        return JsonResponse({"status": "failed", "message": "Méthode non autorisée"}, status=405)

    try:
        data = json.loads(request.body)
        invoice_token = data.get('invoice_token')

        invoice_checker = CheckoutInvoice()
        if not invoice_checker.check_hash(data):
            return JsonResponse({"status": "failed", "message": "Hash invalide"}, status=403)

        commande = get_object_or_404(Commande, transaction_id=invoice_token)
        statut = data.get('status')

        with transaction.atomic():
            if statut == 'completed' and commande.statut == 'en_attente':
                commande.statut = 'payee'
                commande.save()
            elif statut == 'failed' and commande.statut == 'en_attente':
                commande.statut = 'annulee'
                commande.save()

        return JsonResponse({"status": "success", "commande_id": commande.id})

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@login_required
def api_facture_commande(request, id):
    commande = get_object_or_404(Commande, id=id, utilisateur=request.user)

    # 📁 Dossier Téléchargements
    downloads_path = Path.home() / "Downloads"
    filename = f"facture_commande_{commande.id}.pdf"
    facture_path = downloads_path / filename

    # 🧾 Génération du PDF
    c = canvas.Canvas(str(facture_path), pagesize=A4)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(2 * cm, 28 * cm, f"Facture - Commande #{commande.id}")

    c.setFont("Helvetica", 12)
    c.drawString(2 * cm, 27.2 * cm, f"Client : {commande.utilisateur.get_full_name() or commande.utilisateur.username}")
    c.drawString(2 * cm, 26.6 * cm, f"Téléphone : {commande.telephone_livraison or 'Non fourni'}")
    c.drawString(2 * cm, 26.0 * cm, f"Adresse : {commande.adresse_livraison or 'Non précisée'}")
    c.drawString(2 * cm, 25.4 * cm, f"Date : {commande.date_commande.strftime('%d/%m/%Y à %H:%M')}")
    c.drawString(2 * cm, 24.8 * cm, f"Mode de paiement : {commande.mode_paiement}")
    c.drawString(2 * cm, 24.2 * cm, f"Statut : {commande.statut}")

    # 🛒 Détails des produits
    c.setFont("Helvetica-Bold", 13)
    c.drawString(2 * cm, 22.8 * cm, "Articles commandés :")

    y = 22.2 * cm
    c.setFont("Helvetica", 12)
    for item in Details_commande.objects.filter(commande=commande):
        line = f"- {item.produit.nom} x {item.quantite} @ {item.prix_unitaire:.2f} F CFA = {item.prix_unitaire * item.quantite:.2f} F CFA"
        c.drawString(2 * cm, y, line)
        y -= 0.6 * cm
        if y < 2 * cm:
            c.showPage()
            y = 28 * cm

    # 💰 Total
    c.setFont("Helvetica-Bold", 14)
    c.drawString(2 * cm, y - 1 * cm, f"Montant total : {commande.total_prix:.2f} F CFA")

    c.save()

    # 📤 Envoi du fichier
    return FileResponse(open(facture_path, 'rb'), content_type='application/pdf')