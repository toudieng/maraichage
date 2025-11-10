import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import axios from 'axios';

// Imports pour la carte Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 
// Import d'un icône de marqueur personnalisé
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


// Configuration de l'icône Leaflet
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


// ----------------------------------------------------------------------
// FONCTION D'AIDE : FORMATAGE DU PRIX (Correction de l'erreur .toFixed)
// ----------------------------------------------------------------------

const formatPrice = (price) => {
    // 🌟 CORRECTION CRITIQUE : Assurer que le prix est un nombre flottant ou 0
    const numericPrice = parseFloat(price) || 0; 
    
    if (numericPrice === 0) {
        return '0.00'; 
    }
    
    // toFixed(0) pour les F CFA (pas de décimales)
    return numericPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// ----------------------------------------------------------------------
// COMPOSANT PRINCIPAL : PANIER
// ----------------------------------------------------------------------

const Panier = () => {
    
    // 🌟 CORRECTION CRITIQUE : Déstructuration complète des données du contexte
    const { 
        cartItems, 
        getTotal, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        user,
    } = useCart();
    
    const navigate = useNavigate();
    
    // --- États ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [localQuantities, setLocalQuantities] = useState({}); // Pour la gestion de l'input
    
    // Position initiale par défaut (Dakar, Sénégal)
    const [position, setPosition] = useState({ lat: 14.7167, lng: -17.4677 }); 
    const [form, setForm] = useState({
        adresse: user?.adresse || '',
        telephone: user?.telephone || '', // Pré-rempli si l'utilisateur est connecté
        mode_paiement: 'paiement_livraison',
        latitude: position.lat,
        longitude: position.lng,
    });
    
    // Référence pour le marqueur draggable
    const markerRef = useRef(null);

    // ----------------------------------------------------------------------
    // LOGIQUE DE LA CARTE LEAFLET
    // ----------------------------------------------------------------------

    // Simule la recherche d'adresse à partir des coordonnées (peut être remplacé par une API)
    const fetchAddressFromCoords = async (lat, lng) => { // ⬅️ Ajout de 'async'
        try {
            // Appel à l'API Nominatim (OpenStreetMap) pour le géocodage inverse
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            
            // Mettre à jour le formulaire avec le nom d'affichage complet s'il existe
            const newAddress = data?.display_name || `Coordonnées: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            setForm(prev => ({
                ...prev,
                adresse: newAddress, // ✅ Adresse lisible
                latitude: lat,
                longitude: lng,
            }));
        } catch (err) {
            console.error("Erreur géocodage inverse :", err);
            // En cas d'erreur, mettre au moins les coordonnées
            setForm(prev => ({
                ...prev,
                adresse: `Coordonnées: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                latitude: lat,
                longitude: lng,
            }));
        }
    };

    // Composant pour le marqueur déplaçable
    const DraggableMarker = () => {
        const map = useMapEvents({
            // Mise à jour de la position lors d'un clic sur la carte
            click(e) {
                setPosition(e.latlng);
                fetchAddressFromCoords(e.latlng.lat, e.latlng.lng);
            },
        });

        const eventHandlers = {
            // Mise à jour de la position après le glisser-déposer
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    fetchAddressFromCoords(newPos.lat, newPos.lng);
                    map.panTo(newPos);
                }
            },
        };

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
            >
            </Marker>
        );
    };

    // ----------------------------------------------------------------------
    // GESTION DES FORMULAIRES ET ÉTATS
    // ----------------------------------------------------------------------

    useEffect(() => {
        // Mettre à jour l'adresse et les coordonnées dans le formulaire si la position change
        setForm(prev => ({
            ...prev,
            latitude: position.lat,
            longitude: position.lng,
        }));
    }, [position]);

    useEffect(() => {
        // Obtenir le token CSRF au chargement
        axios.get('http://localhost:8000/api/csrf/', {
            withCredentials: true,
        }).catch(err => console.error('Erreur CSRF:', err));

        // ... reste de votre code useEffect
    }, []);


    useEffect(() => {
        // Le endpoint pour récupérer les infos utilisateur
        axios.get('http://localhost:8000/api/user/', {
            withCredentials: true,
        })
        .then(res => {
            // Remplir le champ téléphone avec la donnée de l'API
            setForm(prev => ({ 
                ...prev, 
                telephone: res.data.telephone || '',
                // Vous pouvez aussi charger l'adresse si elle est disponible dans res.data.adresse
                adresse: res.data.adresse || prev.adresse,
            }));
        })
        .catch(err => {
            console.error('Erreur lors du chargement des infos utilisateur :', err);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Logique pour l'input quantité (local)
    const handleLocalChange = (itemId, value) => {
        setLocalQuantities((prev) => ({
            ...prev,
            [itemId]: value,
        }));
    };

    // Fonction pour récupérer le token CSRF depuis les cookies
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    // Mise à jour de la quantité lors du blur de l'input
    const handleInputChange = (itemId, e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;

        // Appeler la fonction de suppression si la quantité est réduite à 0
        if (value === 0) {
            removeFromCart(itemId);
        } else {
            // updateQuantity doit gérer l'appel API au backend (implémenté dans CartContext)
            updateQuantity(itemId, value);
        }

        // Nettoyer la valeur locale après la mise à jour
        setLocalQuantities((prev) => {
            const newState = { ...prev };
            delete newState[itemId];
            return newState;
        });
    };
    
    // Logique pour vider tout le panier
    const handleClearCart = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vider complètement votre panier ?")) {
            clearCart(); 
        }
    };


    // Soumission de la commande
    const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const payload = {
      telephone: form.telephone,
      adresse: form.adresse,
      mode_paiement: form.mode_paiement,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    try {
        const csrftoken = getCookie('csrftoken');
        
        const res = await axios.post('http://localhost:8000/api/commande/valider/', payload, {
        withCredentials: true,
        headers: {
                    'X-CSRFToken': csrftoken,  // Ajout du token CSRF
                    'Content-Type': 'application/json',
                },
      });

    //   if (res.data.success) {
    //     if (res.data.checkout_url) {
    //       window.location.href = res.data.checkout_url;
    //     } else if (res.data.commande_id) {
    //       clearCart();
    //       navigate(`/commande/${res.data.commande_id}`);
    //     } else {
    //       setError("Commande validée mais aucune redirection fournie.");
    //     }
    //   } else {
    //     setError(res.data.error || 'Erreur inconnue');
    //   }
    if (res.data.success) {
            // ✅ Vérifier le mode de paiement
            if (res.data.mode === 'paiement_livraison') {
                // Paiement à la livraison : rediriger vers les détails
                clearCart();
                navigate(`/commande/${res.data.commande_id}`);
            } else if (res.data.checkout_url) {
                // PayDunya : rediriger vers la plateforme
                window.location.href = res.data.checkout_url;
            } else {
                setError("Erreur : mode de paiement inconnu");
            }
        } else {
            setError(res.data.error || 'Erreur inconnue');
        }
    } catch (err) {
      console.error('Erreur lors de la validation :', err);
      setError('Erreur lors de la validation de la commande');
    } finally {
      setLoading(false);
    }
  };


    // ----------------------------------------------------------------------
    // RENDU JSX
    // ----------------------------------------------------------------------
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar /> 
            
            <main className="max-w-7xl !mx-auto !px-4 sm:px-6 lg:px-8 !py-10">
                <div className="bg-white p-6 md:p-10 shadow-lg rounded-none">

                    <h2 className="text-3xl font-extrabold text-gray-900 !mb-8 border-b !pb-4">
                        Finaliser ma commande 🛒
                    </h2>

                    {cartItems.length === 0 ? (
                        <p className="text-gray-600 text-lg">Votre panier est vide. Trouvez de délicieux produits !</p>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            
                            {/* ⬅️ COLONNE 1 : ARTICLES DU PANIER (W-3/5) */}
                            <div className="lg:w-3/5 divide-y overflow-hidden divide-gray-100 !mb-10 !p-6 shadow-lg border border-gray-200">
                                <h3 className="text-xl font-extrabold text-gray-900 !mb-4 !pb-2">1. Articles dans votre Panier</h3>
                                
                                {cartItems.map((item) => {

                                    // 🌟 ASSURER LA RÉSILIENCE ET L'ACCÈS À LA STRUCTURE CORRIGÉE
                                    const produit = item.produit || {}; 
                                    
                                    const nomProduit = produit.nom || 'Produit inconnu'; 
                                    const imageUrl = produit.image_url || ''; 
                                    const prixUnitaire = parseFloat(produit.prix_actuel) || 0; 
                                    
                                    const sousTotal = parseFloat(item.prix_total) || (prixUnitaire * item.quantite);
                                    
                                    const currentQuantity = item.quantite > 0 ? item.quantite : 1;
                                    const inputValue =
                                        localQuantities[item.id] !== undefined
                                            ? localQuantities[item.id]
                                            : String(currentQuantity);

                                    return (
                                        <div
                                            key={item.id}
                                            className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                        >
                                            {/* Image et Infos produit */}
                                            <div className="flex items-center flex-1 min-w-0 !mb-4 sm:mb-0">
                                                {/* Image du produit (utilise imageUrl) */}
                                                <div className="w-16 h-16 bg-gray-100 rounded-none !mr-4 flex-shrink-0 overflow-hidden">
                                                    {imageUrl ? (
                                                        <img 
                                                            src={imageUrl} 
                                                            alt={nomProduit} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                            No Img
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <p className="font-semibold text-lg text-gray-800">{nomProduit}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Prix unitaire : {formatPrice(prixUnitaire)} F CFA
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Contrôles quantité et Prix (À DROITE) */}
                                            <div className="flex items-center !space-x-4">
                                                {/* Groupe de Quantité */}
                                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantite - 1)}
                                                        disabled={item.quantite <= 1}
                                                        className="px-3 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                                                    >
                                                        –
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={inputValue}
                                                        onChange={(e) => handleLocalChange(item.id, e.target.value)}
                                                        onBlur={(e) => handleInputChange(item.id, e)}
                                                        min="1"
                                                        className="w-16 h-full text-center text-lg focus:outline-none bg-gray-50 text-gray-800"
                                                        style={{ appearance: 'none' }} 
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantite + 1)}
                                                        className="px-3 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100 transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Prix total par article */}
                                                <p className="font-extrabold text-lg text-gray-900 w-32 text-right hidden sm:block">
                                                    {formatPrice(sousTotal)} F CFA
                                                </p>
                                                
                                                {/* Supprimer */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 text-2xl hover:text-red-700 transition"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ➡️ COLONNE 2 : RÉCAPITULATIF & CHECKOUT */}
                            <div className="lg:w-2/5 !mb-10 flex flex-col gap-6">

                                {/* BLOC 2.1: RÉSUMÉ DE LA COMMANDE */}
                                <div className="!p-6 bg-white rounded-none shadow-lg border border-gray-200">
                                    <h3 className="text-xl font-extrabold text-gray-900 !mb-4 border-b border-gray-200 !pb-2">2. Résumé de la commande</h3>

                                    {/* Détails des coûts */}
                                    <div className="!space-y-3 text-gray-700">
                                        <div className="flex justify-between">
                                            <span>Sous-total Panier ({cartItems.length} articles) :</span>
                                            {/* 🌟 getTotal est utilisé ici */}
                                            <span>{formatPrice(getTotal())} F CFA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Livraison Estimée :</span>
                                            <span className="text-gray-900 !mb-6 font-semibold">GRATUIT</span>
                                        </div>
                                    </div>
                                    
                                    {/* Total Final */}
                                    <div className="my-6 border-t border-gray-200 pt-4 flex justify-between items-center">
                                        <p className="text-xl font-extrabold text-gray-900">Total à payer :</p>
                                        <p className="text-2xl font-extrabold text-gray-900">
                                            {formatPrice(getTotal())} F CFA
                                        </p>
                                    </div>
                                    
                                    {/* Lien pour vider le panier */}
                                    <button 
                                        onClick={handleClearCart}
                                        className="w-full mt-2 text-sm text-red-500 hover:text-red-700 transition"
                                    >
                                        Vider tout le panier
                                    </button>
                                </div>

                                {/* BLOC 2.2: INFORMATIONS DE LIVRAISON ET PAIEMENT */}
                                <div className="!p-6 bg-white rounded-none shadow-lg border border-gray-200">
                                    <h3 className="text-xl font-extrabold text-gray-900 !mb-4 border-b border-gray-200 !pb-4">3. Adresse et Paiement</h3>
                                    
                                    <div className="space-y-4">
                                        {/* Téléphone (Pré-rempli) */}
                                        <input
                                            type="text"
                                            name="telephone"
                                            placeholder="Téléphone"
                                            value={form.telephone}
                                            onChange={handleChange}
                                            className="w-full border border-gray-400 !my-2 !px-4 !py-1 rounded-none bg-gray-50 disabled:opacity-80"
                                        />

                                        {/* Adresse */}
                                        <input
                                            type="text"
                                            name="adresse"
                                            placeholder="Adresse (cliquez/déplacez le marqueur sur la carte)"
                                            value={form.adresse}
                                            onChange={handleChange}
                                            className="w-full border border-gray-400 !my-2 !px-4 !py-1 rounded-none"
                                        />

                                        {/* Carte Leaflet */}
                                        <div className="h-64 rounded-none !my-2 overflow-hidden border border-gray-300 relative z-0">
                                            <MapContainer 
                                                center={position} 
                                                zoom={13} 
                                                scrollWheelZoom={true} 
                                                style={{ height: '100%', width: '100%' }}
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <DraggableMarker />
                                            </MapContainer>
                                        </div>

                                        {/* Mode de Paiement */}
                                        <select
                                            name="mode_paiement"
                                            value={form.mode_paiement}
                                            onChange={handleChange}
                                            className="w-full border border-gray-400 !px-4 !py-1 !my-2 rounded-none"
                                        >
                                            <option value="paiement_livraison">Paiement à la livraison</option>
                                            <option value="wave">Wave</option>
                                            <option value="orange_money">Orange Money</option>
                                            <option value="carte_bancaire">Carte Bancaire</option>
                                        </select>

                                        {/* Erreur et Bouton Final */}
                                        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-full bg-green-600 text-white !my-3 !py-2 rounded-none font-semibold hover:bg-green-700 transition"
                                            >
                                            {loading ? 'Validation...' : 'Valider la commande'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer /> 
        </div>
    );
};

export default Panier;