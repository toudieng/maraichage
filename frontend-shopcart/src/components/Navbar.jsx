import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import senegalFlag from '../assets/senegal_flag.jpg';
import { X } from "lucide-react";

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-5 h-5 fill-current">
      <path d="M290.4 275.7C274 286 264.5 304.5 265.5 323.8C266.6 343.2 278.2 360.4 295.6 368.9C313.1 377.3 333.8 375.5 349.6 364.3C366 354 375.5 335.5 374.5 316.2C373.4 296.8 361.8 279.6 344.4 271.1C326.9 262.7 306.2 264.5 290.4 275.7zM432.7 207.3C427.5 202.1 421.2 198 414.3 195.3C396.2 188.2 356.7 188.5 331.2 188.8C327.1 188.8 323.3 188.9 320 188.9C316.7 188.9 312.8 188.9 308.6 188.8C283.1 188.5 243.8 188.1 225.7 195.3C218.8 198 212.6 202.1 207.3 207.3C202 212.5 198 218.8 195.3 225.7C188.2 243.8 188.6 283.4 188.8 308.9C188.8 313 188.9 316.8 188.9 320C188.9 323.2 188.9 327 188.8 331.1C188.6 356.6 188.2 396.2 195.3 414.3C198 421.2 202.1 427.4 207.3 432.7C212.5 438 218.8 442 225.7 444.7C243.8 451.8 283.3 451.5 308.8 451.2C312.9 451.2 316.7 451.1 320 451.1C323.3 451.1 327.2 451.1 331.4 451.2C356.9 451.5 396.2 451.9 414.3 444.7C421.2 442 427.4 437.9 432.7 432.7C438 427.5 442 421.2 444.7 414.3C451.9 396.3 451.5 356.9 451.2 331.3C451.2 327.1 451.1 323.2 451.1 319.9C451.1 316.6 451.1 312.8 451.2 308.5C451.5 283 451.9 243.6 444.7 225.5C442 218.6 437.9 212.4 432.7 207.1L432.7 207.3zM365.6 251.8C383.7 263.9 396.2 282.7 400.5 304C404.8 325.3 400.3 347.5 388.2 365.6C382.2 374.6 374.5 382.2 365.6 388.2C356.7 394.2 346.6 398.3 336 400.4C314.7 404.6 292.5 400.2 274.4 388.1C256.3 376 243.8 357.2 239.5 335.9C235.2 314.6 239.7 292.4 251.7 274.3C263.7 256.2 282.6 243.7 303.9 239.4C325.2 235.1 347.4 239.6 365.5 251.6L365.6 251.6zM394.8 250.5C391.7 248.4 389.2 245.4 387.7 241.9C386.2 238.4 385.9 234.6 386.6 230.8C387.3 227 389.2 223.7 391.8 221C394.4 218.3 397.9 216.5 401.6 215.8C405.3 215.1 409.2 215.4 412.7 216.9C416.2 218.4 419.2 220.8 421.3 223.9C423.4 227 424.5 230.7 424.5 234.5C424.5 237 424 239.5 423.1 241.8C422.2 244.1 420.7 246.2 419 248C417.3 249.8 415.1 251.2 412.8 252.2C410.5 253.2 408 253.7 405.5 253.7C401.7 253.7 398 252.6 394.9 250.5L394.8 250.5zM544 160C544 124.7 515.3 96 480 96L160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160zM453 453C434.3 471.7 411.6 477.6 386 478.9C359.6 480.4 280.4 480.4 254 478.9C228.4 477.6 205.7 471.7 187 453C168.3 434.3 162.4 411.6 161.2 386C159.7 359.6 159.7 280.4 161.2 254C162.5 228.4 168.3 205.7 187 187C205.7 168.3 228.5 162.4 254 161.2C280.4 159.7 359.6 159.7 386 161.2C411.6 162.5 434.3 168.3 453 187C471.7 205.7 477.6 228.4 478.8 254C480.3 280.3 480.3 359.4 478.8 385.9C477.5 411.5 471.7 434.2 453 452.9L453 453z"/>
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
        <path d="M389.2 48h70.6L305.6 224.2 487 464H346L246.3 331.8 128.7 464H51.4L193.8 290.7 44 48H180.7L277.6 158.4 389.2 48zm-24.6 288L94.4 79H135L371.7 428.1l-24.6-112.1z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-5 h-5 fill-current">
      <path d="M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z"/>
    </svg>
    
);

// Liste des catégories simplifiée
const CATEGORIES = [
  { name: 'Légumes Racines', slug: 'racines' },
  { name: 'Légumes Fruits', slug: 'fruits' },
  { name: 'Légumes Feuilles', slug: 'feuilles' },
  { name: 'Autres Légumes', slug: 'autres' },
];

const Navbar = () => {

  const cartRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); 
  const navigate = useNavigate();
  const { getTotalItems, cartItems, getTotal, removeFromCart, clearCart } = useCart();
  const [user, setUser] = useState({ username: 'Mon Compte' });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // const isConnected = user && user.username !== "Mon Compte";
  const [isConnected, setIsConnected] = useState(false);

  // Fonction pour ouvrir/fermer le popover du panier
  const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

  // Fonction pour gérer le clic sur "Commander"
  const handleCheckoutClick = () => {
        setIsCartOpen(false); // Ferme le mini-panier
        navigate('/panier'); // Redirige vers la page de validation
    };

  // Fermer le mini-panier lors du clic à l'extérieur (optionnel mais recommandé)
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false); 
            }
        };
        if (isCartOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCartOpen]);

  // 1. Récupération des informations utilisateur (Logique inchangée)
    useEffect(() => {
    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
        .then(res => {
          console.log("Réponse /api/user/", res.data);

          if (res.data.authenticated) {
            setUser(res.data);
            setIsConnected(true);
          } else {
            setUser({ username: 'Mon Compte' });
            setIsConnected(false);
          }
          // setUser(res.data);
          // setIsConnected(true);
        })
        .catch(err => {
            console.error("Erreur lors de la récupération de l'utilisateur :", err);
            // Si échec (non connecté), réinitialisez à la valeur par défaut
            setUser({ username: 'Mon Compte' });
            setIsConnected(false);
        });
}, []);

  // useEffect(() => {
  //   const defaultUser = { username: "Mon Compte" }; 

  //   axios.get('http://localhost:8000/api/user/', { withCredentials: true })
  //     .then(res => {
  //       setUser(res.data);
  //     })
  //     .catch(err => {
  //       console.error("Erreur lors de la récupération de l'utilisateur :", err);
  //       setUser(defaultUser);
  //     });
  // }, []);

  // 2. Logique des suggestions de recherche (Logique inchangée)
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

  // 3. Logique de recherche (Logique inchangée)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recherche?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  // 4. Logique de clic sur suggestion (Logique inchangée)
  const handleSuggestionClick = (nom) => {
    setSearchTerm('');
    setSuggestions([]);
    navigate(`/recherche?query=${encodeURIComponent(nom)}`);
  };

  // 5. Logique de navigation par catégorie (Logique inchangée)
  const handleCategoryClick = (categorySlug) => {
    navigate(`/recherche?category=${encodeURIComponent(categorySlug)}`);
    setIsCategoryOpen(false);
  };

  // 6. Logique de déconnexion (Logique inchangée)
  const handleLogout = async () => {
    try {
        const res = await fetch('http://localhost:8000/api/logout/', {
            method: 'POST',
            credentials: 'include',
        });
        if (res.ok) {
            await clearCart();
            // Réinitialiser les deux états :
            setUser({ username: 'Mon Compte' }); // Rétablit la valeur affichée par défaut
            setIsConnected(false);              // Déconnecte explicitement
            navigate('/');
        } else {
            console.error("Échec de la déconnexion sur le serveur");
        }
    } catch (err) {
        console.error("Erreur de réseau lors de la déconnexion :", err);
    }
};

  // const handleLogout = async () => {
  //   try {
  //     const res = await fetch('http://localhost:8000/api/logout/', {
  //       method: 'POST',
  //       credentials: 'include',
  //     });
  //     if (res.ok) {
  //       await clearCart();
  //       setUser(null);
  //       navigate('/');
  //     } else {
  //       console.error("Échec de la déconnexion sur le serveur");
  //     }
  //   } catch (err) {
  //     console.error("Erreur de réseau lors de la déconnexion :", err);
  //   }
  // };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      
      {/* 🥕 1. TOP BAR (Barre d'entête) - MODIFIÉ */}
      <div className="bg-gray-700 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 h-7 flex justify-between items-center">
          
          <div className="flex items-center space-x-4">
            <span className="flex items-center font-medium">
              📞 <span className="ml-1">78 587 41 10</span>
            </span>
          </div>

          {/* Bloc Gauche : Drapeau du Sénégal (Bordure blanche retirée) */}
          <div className="flex items-center space-x-4">
            <span className="flex items-center font-medium">
              <img 
                src={senegalFlag} 
                alt="Drapeau du Sénégal" 
                // !!! CLASSE 'border border-white' RETIRÉE ICI !!!
                className="w-6 h-4 mr-2" 
              />
              {/* <span className="hidden sm:inline">Livraison au Sénégal</span> */}
            </span>
          </div>
          
          {/* Bloc Droit : Icônes des Réseaux Sociaux (Remplacées par des SVG Font Awesome) */}
          <div className="flex items-center space-x-4 font-medium">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1">
                <InstagramIcon />
            </a>
            
            {/* X (Twitter) */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1">
                <XIcon />
            </a>

            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1">
                <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
      
      {/* 🌿 2. MAIN NAV (Barre Principale) */}
      <div className="border-b border-gray-200">
          {/* CONTENEUR PRINCIPAL FLEX */}
        <div className="max-w-7xl !mx-3 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between"> 

          {/* 1. Bloc Logo (Gauche) */}
          <div className="flex items-center !mr-28 justify-start flex-shrink-0">
              <a href="/" className="flex items-center text-lg font-bold text-gray-900">
                  <span className="text-2xl mr-2">🌿</span>
                  <span>Naatal Mbay</span>
              </a>
          </div>


          {/* 2. Menu principal (Centre) - MODIFIÉ : px-16 pour réduire l'espacement */}
          <nav className="hidden lg:flex items-center flex-1 justify-around text-sm font-medium text-gray-700"> 
            
            {/* Catégories (Menu déroulant) */}
            <div 
              className="relative group" 
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className={`flex items-center hover:text-green-600 transition-colors ${isCategoryOpen ? 'text-green-600' : ''}`}>
                Catégories
                <svg className={`w-3 h-3 !ml-1 transform transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <Link to="/produits" className="hover:text-green-600 transition-colors">Nos produits</Link>
            <Link to="/contact" className="hover:text-green-600 transition-colors">Contact</Link>
          </nav>

          {/* 3. Bloc Recherche + Icônes (Droite) */}
          <div className="flex items-center !ml-28 justify-end flex-shrink-0 gap-4">

            {/* Barre de recherche (Logique inchangée) */}
            <div className="relative hidden lg:block w-60 flex-shrink-0">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-full !my-2 !px-4 !py-2 !pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </form>

              {/* Suggestions (Logique inchangée) */}
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
            <div className="flex items-center gap-1 flex-shrink-0">
              
              {/* Icône de Compte/Profil */}
              <div className="relative group">
                <button className="flex items-center gap-1 !p-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="hidden lg:inline text-sm font-medium">Mon Compte</span> 
                </button>

                {/* Menu déroulant du compte */}
                <div className="absolute right-0 !mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <div className="!px-4 !py-2.5 text-xs text-gray-500 border-b bg-gray-50">
                    {isConnected ? `Bonjour, ${user.username}` : user.username}
                  </div>

                  {isConnected ? (
                    // Options pour utilisateur connecté
                    <>
                      <a href="/profil" className="block !px-4 !py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">Mon profil</a>
                      <a href="/mes-commandes" className="block !px-4 !py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">Mes commandes</a>
                      <a href="/parametres" className="block !px-4 !py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600">Paramètres</a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left !px-4 !py-2 text-sm text-red-600 hover:bg-red-50 border-t"
                      >
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    // Option pour utilisateur déconnecté
                    <Link 
                      to="/connexion" 
                      className="block !px-4 !py-2 text-sm text-green-700 hover:bg-green-50 font-bold"
                    >
                      Se connecter
                    </Link>
                  )}
                </div>
              </div>

                <div className="relative"> 
                    <button 
                        onClick={toggleCart} // Toggle l'ouverture/fermeture
                        className="relative flex items-center gap-1 p-2 rounded hover:bg-gray-50 text-gray-700 hover:text-green-600 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="hidden lg:inline text-sm font-medium">Panier</span> 
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {getTotalItems() > 9 ? '9+' : getTotalItems()}
                            </span>
                        )}
                    </button>
                    
                    {/* 🔥 MINI-PANIER (Popover) */}
                    {isCartOpen && (
                        <div 
                            ref={cartRef}
                            className="absolute right-0 !mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl !p-4 transform translate-x-1/4 md:translate-x-0 z-50"
                            style={{ minHeight: '150px' }} // Petite taille minimale
                        >
                            <h3 className="text-lg font-bold text-gray-800 border-b !pb-2 !mb-3 flex justify-between items-center">
                                Votre Panier 
                                <button onClick={toggleCart} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
                            </h3>
                            
                            {(!cartItems || cartItems.length === 0) ? (
                                <p className="text-gray-500 py-4 text-center">Votre panier est vide.</p>
                            ) : (
                                <>
                                    {console.log("🧺 cartItems Navbar:", cartItems)}
                                    {/* Liste des articles du panier (limité à 3-4 pour un popover) */}
                                    <ul className="!space-y-3 max-h-60 overflow-y-auto !pr-2">
                                        {cartItems.slice(0, 4).map((item, index) => (
                                            <li key={index} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-b-0">
                                                <div className="flex-1 mr-2 font-medium text-gray-700 truncate">
                                                    {item.produit?.nom || item.nom || 'Produit Inconnu'} 
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className="text-xs text-gray-500 !mr-2">{item.quantite} ×</span>
                                                    <span className="font-semibold text-green-700">
                                                        {(item.prix_unitaire * item.quantite).toFixed(2)} F CFA
                                                    </span>
                                                </div>
                                                {/* Bouton supprimer */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)} // 👈 Utilisez item.product.id
                                                    className="!ml-2 text-gray-400 hover:text-red-500 transition"
                                                    title="Supprimer ce produit"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </li>
                                        ))}
                                        {cartItems.length > 4 && (
                                            <li className="text-center pt-2 text-xs text-gray-500">... et {cartItems.length - 4} autre(s) article(s)</li>
                                        )}
                                    </ul>

                                    {/* Total et Bouton Commander */}
                                    <div className="!mt-4 !pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-center !mb-3">
                                            <span className="text-base font-bold text-gray-700">Total :</span>
                                            <span className="text-xl font-extrabold text-green-600">
                                                {getTotal().toFixed(2)} F CFA
                                            </span>
                                        </div>
                                        
                                        <button 
                                            onClick={handleCheckoutClick}
                                            className="w-full !py-1 bg-green-600 text-white font-semibold rounded-none hover:bg-green-700 transition-colors shadow-lg"
                                        >
                                            Passer à la Commande ({getTotalItems()})
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;