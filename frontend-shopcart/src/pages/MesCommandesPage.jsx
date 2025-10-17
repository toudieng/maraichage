// src/pages/MesCommandesPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MesCommandesPage = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');


  useEffect(() => {
    axios.get('http://localhost:8000/api/mes-commandes/', {
      withCredentials: true,
    })
    .then(res => {
      setCommandes(res.data.commandes);
    })
    .catch(err => {
      setError('Erreur lors du chargement des commandes');
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  const commandesFiltrées = filtreStatut === 'tous'
    ? commandes
    : commandes.filter(c => c.statut === filtreStatut);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mes commandes</h2>

        <Link
            to="/"
            className="inline-block mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
            ← Retour à la boutique
        </Link>
        <div className="mb-4">
            <label className="mr-2 font-semibold">Filtrer par statut :</label>
            <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="border px-3 py-1 rounded"
            >
                <option value="tous">Tous</option>
                <option value="en_attente">En attente</option>
                <option value="validée">Validée</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
            </select>
        </div>

      {commandes.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <ul className="space-y-4">
          {commandesFiltrées.map((c) => (
            <li key={c.id} className="border p-4 rounded hover:shadow">
              <p><strong>Commande #{c.id}</strong></p>
              <p>Date : {new Date(c.date).toLocaleString()}</p>
              <p>Statut : {c.statut}</p>
              <p>Total : {Number(c.total).toFixed(2)} €</p>
              <Link
                to={`/commande/${c.id}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Voir les détails →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MesCommandesPage;