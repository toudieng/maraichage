from django.shortcuts import render
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from .models import Panier, Details_panier, Produit, Commande, Details_commande
from produits.utils import get_prix_actuel
from django.db import transaction
from django.db.models import F
from django.urls import reverse
import requests
import json
from .forms import ValidationCommandeForm
from .forms import StatutCommandeForm 
from django.contrib import messages
from utilisateurs.views import is_livreur
from maraichage_ecommerce.paydunya_sdk.checkout import CheckoutInvoice, PaydunyaSetup 

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

    # 1. CRÉATION DE LA COMMANDE ET DES DÉTAILS
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
            
    # 2. CALCUL DU RETURN_URL AVEC L'ID DE LA COMMANDE
    return_url_final = request.build_absolute_uri(
        reverse('paiement_success') + f"?commande_id={commande.id}"
    )

    # 3. APPEL À L'API PAYDUNYA EN UTILISANT LE SDK (CORRIGÉ)
    try:
        # Création de l'objet facture
        invoice = CheckoutInvoice()

        utilisateur = request.user 

        client_nom = f"{utilisateur.first_name} {utilisateur.last_name}".strip()
        if not client_nom:
            client_nom = utilisateur.username

        invoice.customer_name = client_nom
        invoice.customer_email = utilisateur.email
        invoice.customer_phone_number = utilisateur.telephone
        
        
        # Ajout des articles à la facture
        for item in items_for_paydunya:
            invoice.add_item(
                name=item['name'],
                quantity=item['quantity'],
                unit_price=item['unit_price'],
                #total_price=item['total_price'],
                #description=item['description']
            )
        
        # Configuration de la facture
        invoice.total_amount = float(total)
        invoice.description = f"Commande #{commande.id} - Maraîchage Ecommerce"
        invoice.return_url = return_url_final
        invoice.cancel_url = request.build_absolute_uri(reverse('voir_panier'))
        
        # Tente de créer la facture auprès de PayDunya
        if invoice.create():
            # Le SDK stocke l'URL de redirection dans .url (cela inclut le token)
            checkout_url = invoice.url
            token = checkout_url.split('/')[-1] # Extrait le token de l'URL pour le stocker
            
            # Stockage du token pour la vérification future
            commande.transaction_id = token
            commande.save()

            print(f"✅ Redirection vers PayDunya: {checkout_url}")
            return redirect(checkout_url)
        else:
            # L'erreur est stockée dans .response_text par le SDK
            print(f"⚠️ Erreur PayDunya: {invoice.response_text}")
            return render(request, 'echec_paiement.html', {"erreur": invoice.response_text})

    except Exception as e:
        # Erreur générale, y compris les erreurs d'import ou de configuration
        print(f"Erreur fatale lors de l'appel Paydunya: {e}")
        return render(request, 'echec_paiement.html', {"erreur": f"Erreur de traitement interne : {str(e)}"})

@login_required
def paiement_success(request):
    token = request.GET.get("token")
    commande_id = request.GET.get("commande_id")

    if not commande_id or not token:
        # Redirige vers la page d'échec si les paramètres manquent
        return redirect('echec_paiement') 

    try:
        # Récupération de la commande
        commande = get_object_or_404(Commande, id=int(commande_id), utilisateur=request.user)
    except Commande.DoesNotExist:
        return redirect('echec_paiement')

    # Si déjà traitée, on redirige
    if commande.statut != 'en_attente':
        return render(request, 'confirmation_commande.html', {'commande': commande, 'paiement_ok': True})


    # 1. Utilisation de la classe PayDunya pour la vérification
    invoice = CheckoutInvoice()
    
    # Cette méthode utilise l'URL correcte: https://app.paydunya.com/sandbox-api/v1/checkout-invoice/confirm/{token}
    confirmation = invoice.confirm(token) 
    
    print(f"DEBUG PAYDUNYA SDK CONFIRMATION: {confirmation}")
    
    if confirmation and confirmation.get("status") == "completed":
        try:
            with transaction.atomic():
                # Mise à jour du statut
                commande.statut = 'validée'
                commande.transaction_id = token 
                commande.save()

                # Suppression du panier
                try:
                    Panier.objects.get(utilisateur=request.user).delete()
                except Panier.DoesNotExist:
                    pass
                
                # Succès
                return redirect('details_commande', commande_id=commande.id)

        except Exception as e:
            print(f"Erreur interne après confirmation PayDunya: {e}")
            # Vous pourriez vouloir annuler la commande ici aussi si la transaction échoue
            return render(request, 'echec_paiement.html', {"erreur": "Erreur interne après paiement. Contactez le support."})
    else:
        # Échec de la confirmation (statut != completed)
        message = confirmation.get("message", "Paiement non confirmé ou erreur inconnue par PayDunya.") if confirmation and confirmation.get("status") == "error" else confirmation.get("response_text", "Statut non 'completed'.")
        
        commande.statut = 'annulee' 
        commande.save()
            
        return render(request, 'echec_paiement.html', {'erreur': message})

@login_required
def confirmation_commande(request, commande_id):
    """
    Affiche la page de confirmation et le récapitulatif d'une commande spécifique.
    """
    # Récupérer la commande ou retourner une 404 si elle n'existe pas
    commande = get_object_or_404(Commande, pk=commande_id, client=request.user)
    
    # Récupérer tous les articles associés à cette commande
    articles = ArticleCommande.objects.filter(commande=commande)

    context = {
        'commande': commande,
        'articles': articles,
    }
    return render(request, 'confirmation_commande.html', context)


def paydunya_webhook(request):
    # On ne traite que les requêtes POST (envoyées par PayDunya)
    if request.method != 'POST':
        return HttpResponse("Méthode non autorisée", status=405)

    try:
        data = json.loads(request.body)
        invoice_token = data.get('invoice_token')
        
        # 0. SÉCURITÉ : Vérification du Hash
        invoice_checker = CheckoutInvoice()
        if not invoice_checker.check_hash(data):
            # Si le hash n'est pas valide, rejeter la requête
            print("🚨 ALERTE SÉCURITÉ : Hash PayDunya invalide.")
            return JsonResponse({"status": "failed", "message": "Hash invalide"}, status=403)
            
        # 1. Traitement de la COMMANDE et du STATUT
        
        # On utilise le token pour retrouver la commande
        try:
            commande = Commande.objects.get(transaction_id=invoice_token)
        except Commande.DoesNotExist:
            print(f"⚠️ Webhook PayDunya: Commande non trouvée pour le token {invoice_token}")
            return JsonResponse({"status": "failed", "message": "Commande non trouvée"}, status=404)
        
        # Le statut final envoyé par PayDunya (ex: completed, failed, pending)
        paydunya_status = data.get('status') 

        with transaction.atomic():
            if paydunya_status == 'completed' and commande.statut == 'en_attente':
                
                # Le paiement est confirmé, on met à jour le statut
                commande.statut = 'payee' # Utilisez 'payee' ou 'validée'
                commande.save()
                
                # Optionnel : Envoyer un email de confirmation ici
                
                print(f"✅ Webhook PayDunya: Commande #{commande.id} marquée comme payée.")
                
            elif paydunya_status == 'failed' and commande.statut == 'en_attente':
                
                # Le paiement a échoué
                commande.statut = 'annulee'
                commande.save()
                
                print(f"❌ Webhook PayDunya: Commande #{commande.id} annulée (paiement échoué).")
            
            # Si le statut est "completed" mais que la commande est déjà "payee", on ne fait rien (pour éviter les doublons).
            
            # PayDunya s'attend à un code 200 (ou un JsonResponse) pour confirmer la réception
            return JsonResponse({"status": "success", "commande_id": commande.id})

    except json.JSONDecodeError:
        print("🚨 Webhook PayDunya: Données JSON invalides.")
        return JsonResponse({"status": "failed", "message": "JSON invalide"}, status=400)
        
    except Exception as e:
        print(f"🚨 Webhook PayDunya: Erreur inattendue - {e}")
        # Renvoyer une erreur 500 pour que PayDunya puisse réessayer
        return JsonResponse({"status": "error", "message": "Erreur serveur"}, status=500)

def echec_paiement(request):
    """
    Vue pour afficher une page en cas d'échec de paiement.
    """
    return render(request, 'echec_paiement.html')

def details_commande(request, commande_id):
    # Assurez-vous que l'utilisateur ne voit que ses propres commandes
    commande = get_object_or_404(Commande, id=commande_id, utilisateur=request.user) 
    
    # Vous aurez besoin de récupérer aussi les détails des produits de la commande
    details = Details_commande.objects.filter(commande=commande)
    
    context = {
        'commande': commande,
        'details': details,
    }
    return render(request, 'details_commande.html', context)

@login_required
def historique_commandes(request):
    # Récupère toutes les commandes de l'utilisateur actuel, triées par date de création (la plus récente d'abord)
    commandes = Commande.objects.filter(utilisateur=request.user).order_by('-date_commande')
    
    context = {
        'commandes': commandes
    }
    
    return render(request, 'historique_commandes.html', context)


@login_required
def validation_commande(request):
    # ----------------------------------------------------
    # 1. LOGIQUE COMMUNE (CALCUL DU PANIER)
    # ----------------------------------------------------
    try:
        panier = Panier.objects.get(utilisateur=request.user)
        details_du_panier = Details_panier.objects.filter(panier=panier)
    except Panier.DoesNotExist:
        messages.error(request, "Votre panier est vide ou introuvable.")
        return redirect('voir_panier')

    if not details_du_panier:
        messages.error(request, "Votre panier est vide.")
        return redirect('voir_panier')

    total = 0.0
    items_for_paydunya = []
    
    for item in details_du_panier:
        # Assurez-vous que get_prix_actuel retourne un nombre (int ou float)
        prix_actuel = get_prix_actuel(item.produit)
        prix_actuel = float(prix_actuel) 
        item.prix_unitaire_actuel = prix_actuel
        item.prix_total_item = prix_actuel * item.quantite
        total += item.prix_total_item

        items_for_paydunya.append({
            "name": item.produit.nom,
            "quantity": item.quantite,
            "unit_price": float(prix_actuel),
            "total_price": float(item.prix_total_item),
            "description": item.produit.description, # Assurez-vous que 'description' existe
        })
    
    # ----------------------------------------------------
    # 2. GESTION DE LA REQUÊTE POST (VALIDATION ET CRÉATION COMMANDE)
    # ----------------------------------------------------
    if request.method == 'POST':
        form = ValidationCommandeForm(request.POST, instance=request.user) 
        
        if form.is_valid():
            telephone = form.cleaned_data['telephone']
            adresse = form.cleaned_data['adresse']
            mode_paiement = form.cleaned_data['mode_paiement']
            
            utilisateur = request.user
            
            # Mise à jour du profil (si le client a modifié ses coordonnées)
            utilisateur.telephone = telephone
            utilisateur.adresse = adresse
            utilisateur.save() 

            stock_insuffisant = False
            produits_en_erreur = []

            for item in details_du_panier:
                # Récupère le produit avec son stock actuel (à jour)
                produit = item.produit 
                
                if item.quantite > produit.stock:
                    stock_insuffisant = True
                    produits_en_erreur.append(f"{produit.nom} (Stock: {produit.stock}, Demandé: {item.quantite})")
            
            # Si le stock est insuffisant, affiche un message et annule la création de la commande
            if stock_insuffisant:
                messages.error(request, f"Stock insuffisant pour les produits suivants : {', '.join(produits_en_erreur)}. Veuillez ajuster les quantités dans votre panier.")
                return redirect('voir_panier') # Redirige l'utilisateur vers son panier pour corriger
            # 🚨 FIN DU BLOC DE VÉRIFICATION
            
            try:
                with transaction.atomic():
                    mode_paiement = form.cleaned_data['mode_paiement']
                    statut_initial = 'en_attente_livraison' if mode_paiement == 'paiement_livraison' else 'en_attente'
                    # Création de la Commande
                    commande = Commande.objects.create(
                        utilisateur=utilisateur,
                        total_prix=total,
                        statut=statut_initial,
                        adresse_livraison=adresse,
                        telephone_livraison=telephone,
                        mode_paiement=mode_paiement, 
                    )

                    # Création des détails de commande
                    for item in details_du_panier:
                        Details_commande.objects.create(
                            commande=commande,
                            produit=item.produit,
                            prix_unitaire=item.prix_unitaire_actuel,
                            quantite=item.quantite
                        )

                    item.produit.stock = F('stock') - item.quantite
                    item.produit.save(update_fields=['stock'])
                    
                    # 3. LOGIQUE CONDITIONNELLE SELON LE MODE DE PAIEMENT
                    
                    # Méthodes qui passent par l'API PayDunya
                    methode_paydunya = ['wave', 'orange_money', 'carte_bancaire']

                    if mode_paiement in methode_paydunya:
                        # Logique PayDunya complète
                        return_url_final = request.build_absolute_uri(
                             reverse('paiement_success') + f"?commande_id={commande.id}"
                        )
                        
                        invoice = CheckoutInvoice()
                        # Ajouter les détails client à PayDunya
                        invoice.customer_name = getattr(utilisateur, 'get_full_name', lambda: 'Client')( ) or "Client non spécifié"
                        invoice.customer_email = utilisateur.email
                        invoice.customer_phone_number = telephone
                        
                        # Ajouter les items
                        for item_data in items_for_paydunya:
                            invoice.add_item(
                                name=item_data['name'], 
                                quantity=item_data['quantity'], 
                                unit_price=item_data['unit_price']
                            )

                        invoice.total_amount = float(total)
                        invoice.return_url = return_url_final
                        
                        if invoice.create():
                            checkout_url = invoice.url
                            # Sauvegarder l'ID de la transaction PayDunya si nécessaire
                            # commande.transaction_id = checkout_url.split('/')[-1]
                            # commande.save()
                            # Vider le panier après la création de la commande et avant la redirection
                            details_du_panier.delete() 
                            panier.delete()
                            messages.info(request, "Redirection vers la plateforme de paiement...")
                            return redirect(checkout_url)
                        else:
                            messages.error(request, f"Échec de l'initialisation du paiement PayDunya : {invoice.response_text}")
                            commande.statut = 'annulee'
                            commande.save()
                            return redirect('echec_paiement') 
                            
                    elif mode_paiement == 'paiement_livraison': # 🚨 Corrigé : utilise la clé 'paiement_livraison'
                        # Vider le panier
                        details_du_panier.delete() 
                        panier.delete()
                        messages.success(request, "Votre commande a été enregistrée. Paiement à la livraison sélectionné.")
                        # Redirection vers les détails de la commande ou la confirmation
                        return redirect('details_commande', commande_id=commande.id)

            except Exception as e:
                print(f"Erreur fatale lors du traitement de la commande : {e}")
                messages.error(request, f"Erreur fatale lors du traitement de la commande : {str(e)}")
                return redirect('echec_paiement')
                
        else:
            messages.error(request, "Veuillez corriger les erreurs dans les informations de livraison et/ou mode de paiement.")

    # ----------------------------------------------------
    # 4. GESTION DE LA REQUÊTE GET (AFFICHAGE DU FORMULAIRE)
    # ----------------------------------------------------
    else:
        # Initialisation du formulaire avec les données actuelles du profil
        form = ValidationCommandeForm(instance=request.user) 

    context = {
        'form': form,
        'details_du_panier': details_du_panier,
        'total': total
    }
    return render(request, 'validation_commande.html', context)




# Fonction utilitaire pour vérifier si l'utilisateur est un staff (administrateur)
def is_staff_user(user):
    return user.is_staff

# @login_required
# @user_passes_test(is_staff_user) # 🚨 Sécurité : seul le personnel (staff) peut y accéder
# def tableau_bord_commandes(request):
#     """
#     Affiche la liste de toutes les commandes pour l'administration.
#     """
#     # Récupère toutes les commandes, triées par date (récentes en premier)
#     commandes = Commande.objects.all().order_by('-date_commande')

#     # Filtrage rapide pour les commandes en attente (par exemple)
#     commandes_en_attente = Commande.objects.filter(statut='en_attente').order_by('-date_commande')

#     context = {
#         'commandes': commandes,
#         'commandes_en_attente': commandes_en_attente,
#     }
#     return render(request, 'tableau_bord_commandes.html', context)


@login_required
@user_passes_test(is_staff_user)
def tableau_bord_commandes(request):
    commandes_qs = Commande.objects.all().order_by('-date_commande')

    commandes_data = []
    for commande in commandes_qs:
        statut_form = StatutCommandeForm(instance=commande)
        commandes_data.append({
            'commande': commande,
            'statut_form': statut_form,
        })

    context = {
        'commandes_data': commandes_data,
    }
    return render(request, 'tableau_bord_commandes.html', context)

@login_required
@user_passes_test(is_staff_user)
def mettre_a_jour_statut(request, commande_id):
    """
    Met à jour le statut d'une commande spécifique via une requête POST.
    """
    commande = get_object_or_404(Commande, id=commande_id)

    if request.method == 'POST':
        nouveau_statut = request.POST.get('statut')
        
        # Vérification simple pour s'assurer que le statut est valide (selon vos choix)
        statuts_valides = [choix[0] for choix in Commande.STATUT_CHOICES] # Assurez-vous que ceci fonctionne
        
        if nouveau_statut and nouveau_statut in statuts_valides:
            commande.statut = nouveau_statut
            commande.save()
            messages.success(request, f"Le statut de la commande N°{commande.id} a été mis à jour à '{commande.get_statut_display()}'.")
        else:
            messages.error(request, "Statut invalide ou manquant.")
            
    # Redirige toujours vers le tableau de bord
    return redirect('tableau_bord_commandes') 

# commandes/views.py

@login_required
@user_passes_test(is_livreur)
def valider_livraison(request, commande_id):
    commande = get_object_or_404(Commande, id=commande_id)

    if request.method == 'POST':
        nouveau_statut = request.POST.get('statut')
        
        # 🚨 Restreindre le changement de statut !
        if nouveau_statut == 'livree':
            commande.statut = 'livree'
            commande.save()
            messages.success(request, f"La livraison de la commande N°{commande.id} a été confirmée.")
        else:
            messages.error(request, "Seul le statut 'Livrée' est autorisé.")
            
        return redirect('tableau_de_bord_livreur') # Une autre page d'accueil
    
    # Rendre le formulaire de confirmation (une page simple)
    return render(request, 'livreur/confirmation_livraison.html', {'commande': commande})

@login_required
@user_passes_test(is_livreur) # Protégé uniquement pour les livreurs
def tableau_de_bord_livreur(request):
    # 🚨 Logique: Afficher les commandes que le livreur doit potentiellement livrer.
    # Dans l'exemple, on affiche toutes les commandes 'validée' (prêtes à l'envoi)
    commandes_a_livrer = Commande.objects.filter(statut='validée').order_by('date_commande')

    context = {
        'commandes_a_livrer': commandes_a_livrer
    }
    return render(request, 'livreur/dashboard_livreur.html', context)