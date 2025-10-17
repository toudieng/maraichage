import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [user, setUser] = useState(null);

  // 1. Récupération des informations utilisateur
  useEffect(() => {
    // Utilisation du contact du projet comme référence si l'API user échoue
    const defaultUser = { username: "Mon Compte" }; 

    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setUser(defaultUser); // Définir un utilisateur par défaut si la connexion échoue
      });
  }, []);

  // 2. Logique des suggestions de recherche
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // Note: L'URL de l'API des produits est utilisée ici. Assurez-vous qu'elle retourne bien les données.
    axios.get('http://localhost:8000/produits/api/produits/')
      .then(res => {
        const filtered = res.data.filter(product =>
          product.nom?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      })
      .catch(err => {
        console.error('Erreur suggestions :', err);
        setSuggestions([]);
      });
  }, [searchTerm]);

  // 3. Logique de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recherche?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  // 4. Logique de clic sur suggestion
  const handleSuggestionClick = (nom) => {
    setSearchTerm('');
    setSuggestions([]);
    navigate(`/recherche?query=${encodeURIComponent(nom)}`);
  };

  // 5. Logique de déconnexion
  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setUser(null); // Réinitialiser l'utilisateur après déconnexion
        navigate('/connexion');
      } else {
        console.error("Échec de la déconnexion sur le serveur");
      }
    } catch (err) {
      console.error("Erreur de réseau lors de la déconnexion :", err);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-lg">
      
      {/* 🥕 1. TOP BAR (Barre Supérieure) - Inspirée du site de référence */}
      <div className="hidden md:block bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          {/* Information à gauche */}
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              📞 <strong className="ml-1 text-green-700 font-semibold">78 587 41 10</strong> {/* Numéro de contact du projet */}
            </span>
          </div>
          
          {/* Liens à droite */}
          <div className="flex items-center space-x-6 font-medium">
            <a href="/devis" className="hover:text-green-600 transition-colors">Obtenir un devis</a>
            <a href="/localisation" className="hover:text-green-600 transition-colors">📍 Localisation</a>
            <span className="text-gray-400 select-none">|</span>
            <a href="/faq" className="hover:text-green-600 transition-colors">FAQ</a>
          </div>
        </div>
      </div>
      
      {/* 🌿 2. MAIN NAV (Barre Principale) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="/" className="flex items-center text-2xl font-extrabold text-green-700 tracking-wide">
          <span className="text-4xl mr-1">🌿</span> {/* Icône de feuille pour le maraîchage */}
          Naatal Mbay
        </a>

        {/* Menu principal */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-bold">
          <a href="/categories" className="hover:text-green-600 transition-colors">Catégories</a>
          <a href="/promos" className="hover:text-green-600 transition-colors">Promos</a>
          <a href="/nouveautes" className="hover:text-green-600 transition-colors">Nouveautés</a>
          <a href="/livraison" className="hover:text-green-600 transition-colors">Livraison</a>
          <a href="/contact" className="hover:text-green-600 transition-colors">Contact</a>
        </nav>

        {/* Barre de recherche + icônes */}
        <div className="flex items-center gap-6">

          {/* Barre de recherche */}
          <div className="relative hidden lg:block w-80">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-700 transition-colors">
                {/* SVG Icône de recherche */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </form>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-green-500 rounded-lg shadow-xl mt-2 z-50 overflow-hidden">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.nom)}
                    className="px-4 py-3 hover:bg-green-50 cursor-pointer text-gray-800 text-sm truncate"
                  >
                    {item.nom}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Icônes (Compte, Panier) */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            
            {/* Icône de Compte/Profil (Hub utilisateur) */}
            <div className="relative group">
              <div className="flex items-center cursor-pointer p-2 rounded-full text-gray-700 hover:text-green-700 transition">
                {/* SVG Icône Utilisateur */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>

              {/* Menu déroulant */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 overflow-hidden">
                <div className="px-4 py-2 text-sm text-gray-500 border-b">
                  {user && user.username !== 'Mon Compte' ? `Bonjour, ${user.username}` : 'Options du compte'}
                </div>
                <a href="/profil" className="block px-4 py-2 hover:bg-green-50 text-gray-700">Mon profil</a>
                <a href="/mes-commandes" className="block px-4 py-2 hover:bg-green-50 text-gray-700">Mes commandes</a>
                <a href={user ? '/parametres' : '/connexion'} className="block px-4 py-2 hover:bg-green-50 text-gray-700">
                  {user && user.username !== 'Mon Compte' ? 'Paramètres' : 'Se connecter'}
                </a>
                {user && user.username !== 'Mon Compte' && (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 border-t"
                  >
                    Se déconnecter
                  </button>
                )}
              </div>
            </div>

            {/* Icône de Panier */}
            <a href="/panier" className="relative text-xl p-2 rounded-full text-gray-700 hover:text-green-700 transition">
              {/* SVG Icône Panier */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white transform translate-x-1 -translate-y-1">
                  {getTotalItems() > 9 ? '9+' : getTotalItems()}
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;