// src/pages/CommandePage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CommandeActions from '../components/CommandeActions';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import d'un icône de marqueur personnalisé
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// --- Configuration de l'icône Leaflet (Réutilisée pour cohérence) ---
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Helper pour le formatage des prix (Réutilisé pour cohérence) ---
const formatPrice = (price) => {
    const numericPrice = parseFloat(price) || 0; 
    return numericPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// --- Fonction pour obtenir le style de statut (Réutilisée) ---
const getStatusClasses = (statut) => {
    switch (statut) {
        case 'en_attente':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        case 'en_cours':
            return 'bg-blue-100 text-blue-800 border border-blue-300';
        case 'livree':
            return 'bg-green-100 text-green-800 border border-green-300';
        case 'annulee':
            return 'bg-red-100 text-red-800 border border-red-300';
        default:
            return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
};

// ----------------------------------------------------------------------
// COMPOSANT PRINCIPAL
// ----------------------------------------------------------------------

const CommandePage = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/commande/${id}/`, {
      withCredentials: true,
    })
    .then(res => {
      setCommande(res.data.commande);
    })
    .catch(err => {
      setError('Erreur lors du chargement de la commande');
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><div className="text-xl text-gray-600 p-10">Chargement...</div></div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><div className="p-8 text-red-600 border border-red-300 bg-red-50 rounded-lg shadow-md">{error}</div></div>;
  if (!commande) return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><div className="p-8 text-gray-600 border border-gray-300 bg-gray-50 rounded-lg shadow-md">Commande introuvable.</div></div>;

  const position = [commande.latitude || 14.7645, commande.longitude || -17.3660];
  const statutClasses = getStatusClasses(commande.statut);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto !px-4 sm:px-6 lg:px-8 !py-10">
        
        <div className="text-sm text-gray-500 !mb-6">
            <a href="/commandes" onClick={(e) => { e.preventDefault(); navigate('/commandes'); }} className="hover:text-green-600">Mes Commandes</a> &gt; Commande #{commande.id}
        </div>

        {/* 3. Bloc principal de contenu (fond blanc, ombre, padding) - Réplique de ProductDetail */}
        <div className="bg-white !p-6 md:p-10 shadow-lg rounded-xl">

          {/* --- EN-TÊTE --- */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !pb-6 border-b border-gray-200 !mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 !mb-2 sm:mb-0">
              Commande <span className="text-gray-900">#{commande.id}</span>
            </h2>
            <span className={`px-3 !py-1 text-sm font-semibold rounded-full uppercase ${statutClasses}`}>
              {commande.statut.replace('_', ' ')}
            </span>
          </div>

          {/* --- Contenu en deux colonnes (simulation) pour les détails et la carte --- */}
          <div className="flex flex-col lg:flex-row gap-8">
              {/* ⬅️ COLONNE GAUCHE : Détails */}
              <div className="lg:w-3/5">
                  
                  {/* Détails de Livraison */}
                  <div className="!mb-8 !p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 !mb-3">Informations de Livraison 🚚</h3>
                    <p className="!mb-2 text-gray-600">
                        <strong>Adresse :</strong> <span className="font-medium text-gray-900">{commande.adresse_livraison}</span>
                    </p>
                    <p className="!mb-2 text-gray-600">
                        <strong>Téléphone :</strong> <span className="font-medium text-gray-900">{commande.telephone_livraison}</span>
                    </p>
                    <p className="!mb-2 text-gray-600">
                        <strong>Paiement :</strong> <span className="font-medium text-gray-900 capitalize">{commande.mode_paiement.replace('_', ' ')}</span>
                    </p>
                  </div>

                  {/* Liste des Produits */}
                  <div className="!mb-8">
                    <h3 className="text-xl font-bold text-gray-800 !mb-4 border-b border-gray-200 !pb-2">Articles Commandés 📦</h3>
                    <ul className="divide-y divide-gray-200">
                        {commande.produits.map((item, index) => (
                            <li 
                                key={index} 
                                className="flex justify-between items-center !py-3 text-gray-700"
                            >
                                <span className="font-medium text-gray-900">{item.nom}</span>
                                <div className="text-right">
                                    <span className="text-sm !mr-4 text-gray-500">x{item.quantite}</span>
                                    <span className="font-semibold">{formatPrice(item.prix_total)} F CFA</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                  </div>
              </div>

              {/* ➡️ COLONNE DROITE : Carte et Total (Plus compact sur grand écran) */}
              <div className="lg:w-2/5">
                  
                  {/* Total Final (Mis en évidence) */}
                  <div className="flex flex-col !py-4 bg-green-50/50 border-y-2 border-green-600 !px-4 !mb-8 rounded-lg shadow-inner">
                    <span className="text-lg font-bold text-gray-700 !mb-1">Total à régler :</span>
                    <p className="text-3xl font-extrabold text-gray-900">
                        <span className="text-green-600">{formatPrice(commande.total_prix)} F CFA</span>
                    </p>
                  </div>
                  
                  {/* Carte Leaflet (Position de Livraison) */}
                  <div className="!mb-8">
                    <h3 className="text-xl font-bold text-gray-800 !mb-3">Localisation de la Livraison 📍</h3>
                    <div className="h-64 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                        <MapContainer 
                            center={position} 
                            zoom={14} 
                            scrollWheelZoom={false} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position} />
                        </MapContainer>
                    </div>
                  </div>

                  {/* Actions de la Commande */}
                  <div className="!pt-4 border-t border-gray-200">
                    <CommandeActions commandeId={commande.id} />
                  </div>

              </div>
          </div>
        </div>
      </main>
      
      <Footer /> 
    </div>
  );
};

export default CommandePage;