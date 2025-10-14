// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    telephone: '',
    adresse: '',
    mode_paiement: 'paiement_livraison',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((sum, item) => sum + item.prix_total, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/commande/valider/', form, {
        withCredentials: true,
      });

      if (res.data.success) {
        if (res.data.checkout_url) {
          window.location.href = res.data.checkout_url; // Redirection PayDunya
        } else {
          clearCart();
          navigate(`/commande/${res.data.commande_id}`);
        }
      } else {
        setError(res.data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError('Erreur lors de la validation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Validation de la commande</h2>

      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <ul className="mb-6">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.produit} x {item.quantite}</span>
                <span>{item.prix_total.toFixed(2)} €</span>
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
            />
            <input
              type="text"
              name="adresse"
              placeholder="Adresse de livraison"
              value={form.adresse}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
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
