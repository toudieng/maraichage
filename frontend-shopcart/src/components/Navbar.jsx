import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

// Liste des catégories simplifiée
const CATEGORIES = [
  { name: 'Légumes Racines', slug: 'racines' },
  { name: 'Légumes Fruits', slug: 'fruits' },
  { name: 'Légumes Feuilles', slug: 'feuilles' },
  { name: 'Autres Légumes', slug: 'autres' },
];

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); 
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [user, setUser] = useState(null);

  // 1. Récupération des informations utilisateur
  useEffect(() => {
    const defaultUser = { username: "Mon Compte" }; 

    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setUser(defaultUser);
      });
  }, []);

  // 2. Logique des suggestions de recherche
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

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

  // 5. Logique de navigation par catégorie
  const handleCategoryClick = (categorySlug) => {
    navigate(`/recherche?category=${encodeURIComponent(categorySlug)}`);
    setIsCategoryOpen(false);
  };

  // 6. Logique de déconnexion
  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setUser(null);
        navigate('/connexion');
      } else {
        console.error("Échec de la déconnexion sur le serveur");
      }
    } catch (err) {
      console.error("Erreur de réseau lors de la déconnexion :", err);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      
      {/* 🥕 1. TOP BAR (Barre Supérieure Verte) */}
      <div className="bg-green-700 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center font-medium">
              📞 <span className="ml-1">78 587 41 10</span>
            </span>
            <span className="hidden md:inline opacity-60">|</span>
            <span className="hidden md:inline opacity-90">Livraison gratuite à partir de 50 000 FCFA</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 font-medium">
            <a href="/localisation" className="hover:opacity-80 transition-opacity">📍 Localisation</a>
            <a href="/devis" className="hover:opacity-80 transition-opacity">Obtenir un devis</a>
          </div>
        </div>
      </div>
      
      {/* 🌿 2. MAIN NAV (Barre Principale) */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">

          {/* Logo */}
          <a href="/" className="flex items-center text-lg font-bold text-gray-900">
            <span className="text-2xl mr-2">🌿</span>
            <span>Naatal Mbay</span>
          </a>

          {/* Menu principal */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700">
            
            {/* Catégories (Menu déroulant) */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className={`flex items-center hover:text-green-600 transition-colors ${isCategoryOpen ? 'text-green-600' : ''}`}>
                Catégories
                <svg className={`w-3 h-3 ml-1 transform transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {/* Contenu du menu déroulant */}
              {isCategoryOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <button 
                      key={cat.slug} 
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="/deals" className="hover:text-green-600 transition-colors">Promos</a>
            <a href="/nouveautes" className="hover:text-green-600 transition-colors">Nouveautés</a>
            <a href="/livraison" className="hover:text-green-600 transition-colors">Livraison</a>
            <a href="/contact" className="hover:text-green-600 transition-colors">Contact</a>
          </nav>

          {/* Barre de recherche + icônes */}
          <div className="flex items-center gap-4">

            {/* Barre de recherche */}
            <div className="relative hidden lg:block w-72">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </form>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 overflow-hidden">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.nom)}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                    >
                      {item.nom}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Icônes (Compte, Panier) */}
            <div className="flex items-center gap-1">
              
              {/* Icône de Compte/Profil */}
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="hidden xl:inline text-sm font-medium">Compte</span>
                </button>

                {/* Menu déroulant du compte */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <div className="px-4 py-2.5 text-xs text-gray-500 border-b bg-gray-50">
                    {user && user.username !== 'Mon Compte' ? `Bonjour, ${user.username}` : 'Mon compte'}
                  </div>
                  <a href="/profil" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">Mon profil</a>
                  <a href="/mes-commandes" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">Mes commandes</a>
                  <a href={user && user.username !== 'Mon Compte' ? '/parametres' : '/connexion'} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">
                    {user && user.username !== 'Mon Compte' ? 'Paramètres' : 'Se connecter'}
                  </a>
                  {user && user.username !== 'Mon Compte' && (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t"
                    >
                      Se déconnecter
                    </button>
                  )}
                </div>
              </div>

              {/* Icône de Panier */}
              <a href="/panier" className="relative flex items-center gap-1 p-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span className="hidden xl:inline text-sm font-medium">Panier</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getTotalItems() > 9 ? '9+' : getTotalItems()}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;