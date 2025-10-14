from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from .models import Produit, Panier, Details_panier
import json
from produits.utils import get_prix_actuel

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
            prix = get_prix_actuel(item.produit)
            print(f"🧾 Item {item.id} | Produit : {item.produit.nom} | Quantité : {item.quantite} | Prix unitaire : {prix}")

            data.append({
                'id': item.id,
                'produit': item.produit.nom,
                'quantite': item.quantite,
                'prix_unitaire': prix,
                'prix_total': prix * item.quantite,
            })

        return JsonResponse({'panier': data})
    except Panier.DoesNotExist:
        print("⚠️ Aucun panier trouvé pour l’utilisateur :", request.user.username)
        return JsonResponse({'panier': []})


@csrf_exempt
@login_required
def api_update_panier_item(request):
    if request.method == 'POST':
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
        telephone = data.get('telephone')
        adresse = data.get('adresse')
        mode_paiement = data.get('mode_paiement')

        utilisateur = request.user
        panier = Panier.objects.get(utilisateur=utilisateur)
        details_du_panier = Details_panier.objects.filter(panier=panier)

        if not details_du_panier:
            return JsonResponse({'error': 'Panier vide'}, status=400)

        total = 0.0
        items_for_paydunya = []

        for item in details_du_panier:
            prix = get_prix_actuel(item.produit)
            item.prix_unitaire_actuel = prix
            item.prix_total_item = prix * item.quantite
            total += item.prix_total_item
            items_for_paydunya.append({
                "name": item.produit.nom,
                "quantity": item.quantite,
                "unit_price": float(prix),
                "description": item.produit.description,
            })

        with transaction.atomic():
            statut_initial = 'en_attente_livraison' if mode_paiement == 'paiement_livraison' else 'en_attente'
            commande = Commande.objects.create(
                utilisateur=utilisateur,
                total_prix=total,
                statut=statut_initial,
                adresse_livraison=adresse,
                telephone_livraison=telephone,
                mode_paiement=mode_paiement,
            )

            for item in details_du_panier:
                Details_commande.objects.create(
                    commande=commande,
                    produit=item.produit,
                    prix_unitaire=item.prix_unitaire_actuel,
                    quantite=item.quantite
                )
                item.produit.stock = F('stock') - item.quantite
                item.produit.save(update_fields=['stock'])

            # Appel PayDunya
            invoice = CheckoutInvoice()
            invoice.customer_name = utilisateur.get_full_name() or utilisateur.username
            invoice.customer_email = utilisateur.email
            invoice.customer_phone_number = utilisateur.telephone
            for item in items_for_paydunya:
                invoice.add_item(**item)
            invoice.total_amount = float(total)
            invoice.description = f"Commande #{commande.id} - Maraîchage Ecommerce"
            invoice.return_url = request.build_absolute_uri(reverse('paiement_success')) + f"?commande_id={commande.id}"
            invoice.cancel_url = request.build_absolute_uri(reverse('voir_panier'))

            if invoice.create():
                commande.transaction_id = invoice.url.split('/')[-1]
                commande.save()
                return JsonResponse({'success': True, 'checkout_url': invoice.url})
            else:
                return JsonResponse({'success': False, 'error': invoice.response_text}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def api_details_commande(request, commande_id):
    try:
        commande = get_object_or_404(Commande, id=commande_id, utilisateur=request.user)
        details = Details_commande.objects.filter(commande=commande)
        items = [{
            'produit': d.produit.nom,
            'quantite': d.quantite,
            'prix_unitaire': d.prix_unitaire,
            'prix_total': d.prix_unitaire * d.quantite
        } for d in details]
        return JsonResponse({
            'commande_id': commande.id,
            'statut': commande.statut,
            'total': commande.total_prix,
            'items': items
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

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
