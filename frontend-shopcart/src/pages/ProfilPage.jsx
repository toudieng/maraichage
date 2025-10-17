// src/pages/ProfilPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilPage = () => {
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then(res => {
        setFormData({
          nom_complet: res.data.nom_complet || '',
          email: res.data.email || '',
          telephone: res.data.telephone || '',
        });
      })
      .catch(err => {
        console.error("Erreur chargement profil :", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/profil/', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => {
        setMessage("Profil mis à jour avec succès !");
      })
      .catch(err => {
        console.error("Erreur mise à jour :", err);
        setMessage("Erreur lors de la mise à jour du profil.");
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier mon Profil</h2>

      {message && (
        <div className="mb-4 text-green-600 font-semibold">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Nom complet</label>
          <input
            type="text"
            name="nom_complet"
            value={formData.nom_complet}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Téléphone</label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default ProfilPage;
