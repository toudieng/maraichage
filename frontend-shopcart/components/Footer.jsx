// components/Footer.jsx

import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-12 pt-10 pb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Ligne principale du Footer (Liens rapides) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-6">
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-green-400">ShopCart</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition">À Propos</a></li>
                            <li><a href="#" className="hover:text-green-400 transition">Carrières</a></li>
                            <li><a href="#" className="hover:text-green-400 transition">Actualités</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-green-400">Aide</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition">Paiement</a></li>
                            <li><a href="#" className="hover:text-green-400 transition">Livraison</a></li>
                            <li><a href="#" className="hover:text-green-400 transition">Retours</a></li>
                            <li><a href="#" className="hover:text-green-400 transition">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-green-400">Légal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition">Termes & Conditions</a></li>
                            <li><a href="#" className="hover:text-green-400 transition">Politique de Confidentialité</a></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="font-bold text-lg mb-4 text-green-400">Contact</h4>
                        <p className="text-sm text-gray-400">Dakar, Sénégal</p>
                        <p className="text-sm text-gray-400">Email: contact@natalmbey.com</p>
                    </div>
                </div>

                {/* Ligne Copyright */}
                <div className="text-center text-sm text-gray-500 pt-4">
                    <p>&copy; {new Date().getFullYear()} PROJET NATAL MBEY. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;