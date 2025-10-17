import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    telephone: '',
    adresse: '',
    mode_paiement: 'paiement_livraison',
  });

  const [position, setPosition] = useState([14.7645, -17.3660]); // Dakar par défaut
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cartItems.reduce((sum, item) => sum + Number(item.prix_total || 0), 0);

  useEffect(() => {
    axios.get('http://localhost:8000/api/user/', {
      withCredentials: true,
    })
    .then(res => {
      setForm(prev => ({ ...prev, telephone: res.data.telephone || '' }));
    })
    .catch(err => {
      console.error('Erreur utilisateur :', err);
    });
  }, []);

  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data?.display_name) {
        setForm(prev => ({ ...prev, adresse: data.display_name }));
      }
    } catch (err) {
      console.error("Erreur reverse geocoding :", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const payload = {
      telephone: form.telephone,
      adresse: form.adresse,
      mode_paiement: form.mode_paiement,
      latitude: position[0],
      longitude: position[1],
    };

    try {
      const res = await axios.post('http://localhost:8000/api/commande/valider/', payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data.checkout_url) {
          window.location.href = res.data.checkout_url;
        } else if (res.data.commande_id) {
          clearCart();
          navigate(`/commande/${res.data.commande_id}`);
        } else {
          setError("Commande validée mais aucune redirection fournie.");
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

  const DraggableMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddressFromCoords(e.latlng.lat, e.latlng.lng);
      },
    });

    return (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            setPosition([lat, lng]);
            fetchAddressFromCoords(lat, lng);
          },
        }}
        icon={L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      />
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Validation de la commande</h2>

      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <ul className="mb-6">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.produit} x {item.quantite}</span>
                <span>{Number(item.prix_total || 0).toFixed(2)} €</span>
              </li>
            ))}
          </ul>

          <p className="text-xl font-bold mb-4">Total : {total.toFixed(2)} €</p>

          <div className="space-y-4">
            <input
              type="text"
              name="telephone"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              disabled
            />

            <input
              type="text"
              name="adresse"
              placeholder="Adresse (optionnelle)"
              value={form.adresse}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />

            <div className="h-64 rounded-lg overflow-hidden border">
              <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker />
              </MapContainer>
            </div>

            <select
              name="mode_paiement"
              value={form.mode_paiement}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="paiement_livraison">Paiement à la livraison</option>
              <option value="wave">Wave</option>
              <option value="orange_money">Orange Money</option>
              <option value="carte_bancaire">Carte Bancaire</option>
            </select>

            {error && <p className="text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? 'Validation...' : 'Valider la commande'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
