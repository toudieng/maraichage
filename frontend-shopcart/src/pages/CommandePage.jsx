// src/pages/CommandePage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CommandeActions from '../components/CommandeActions';

const CommandePage = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!commande) return <div className="p-6">Commande introuvable.</div>;

  const position = [commande.latitude || 14.7645, commande.longitude || -17.3660];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Commande #{commande.id}</h2>

      <p className="mb-2"><strong>Statut :</strong> {commande.statut}</p>
      <p className="mb-2"><strong>Adresse :</strong> {commande.adresse_livraison}</p>
      <p className="mb-2"><strong>Téléphone :</strong> {commande.telephone_livraison}</p>

      <ul className="mb-6">
        {commande.produits.map((item, index) => (
          <li key={index} className="flex justify-between py-2 border-b">
            <span>{item.nom} x {item.quantite}</span>
            <span>{Number(item.prix_total).toFixed(2)} €</span>
          </li>
        ))}
      </ul>

      <p className="text-xl font-bold mb-4">Total : {Number(commande.total_prix).toFixed(2)} €</p>

      <div className="h-64 rounded-lg overflow-hidden border">
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={position}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          />
        </MapContainer>
        
      </div>
      <br />
      <CommandeActions commandeId={commande.id} />
      <br />
    </div>
  );
};

export default CommandePage;
