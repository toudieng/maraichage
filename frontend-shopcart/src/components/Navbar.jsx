// components/Navbar.jsx

import React from 'react';
// 🚨 Importez les composants nécessaires
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faUser, 
    faShoppingCart, 
    faBars 
    // Assurez-vous d'importer TOUTES les icônes utilisées
} from '@fortawesome/free-solid-svg-icons'; 

const Navbar = () => {
    const panierCount = 3; 

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ... (Ligne 1: Contact Top Bar) ... */}

                {/* Ligne 2: Barre de Navigation Principale */}
                <div className="flex items-center justify-between py-4">
                    
                    {/* Logo/Nom du Site (Gauche) */}
                    <div className="flex items-center space-x-6">
                        <a href="/" className="text-2xl font-extrabold text-green-700">
                            ShopCart <FontAwesomeIcon icon={faShoppingCart} className="text-yellow-500" />
                        </a>
                        {/* ... (Menu principal) ... */}
                    </div>
                    
                    {/* Barre de Recherche Centrale */}
                    <div className="hidden lg:block flex-grow max-w-lg mx-8">
                        <div className="relative">
                            <input 
                                // ... (input styles)
                            />
                            <button className="absolute right-0 top-0 mt-0.5 mr-1 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                                {/* 🚨 Remplacement de <i> par le composant */}
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Icônes/Actions (Droite) */}
                    <div className="flex items-center space-x-5 text-gray-600">
                        {/* Compte Utilisateur */}
                        <a href="#" title="Mon Compte" className="relative p-2 rounded-full hover:bg-gray-100 transition">
                            <FontAwesomeIcon icon={faUser} size="lg" /> {/* 🚨 Remplacement */}
                        </a>
                        
                        {/* Panier */}
                        <a href="#" title="Mon Panier" className="relative p-2 rounded-full hover:bg-gray-100 transition">
                            <FontAwesomeIcon icon={faShoppingCart} size="lg" /> {/* 🚨 Remplacement */}
                            {/* ... (Badge du panier) ... */}
                        </a>
                        
                        {/* Mobile Menu Toggle */}
                        <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition">
                            <FontAwesomeIcon icon={faBars} size="lg" /> {/* 🚨 Remplacement */}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;