// frontend-shopcart/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx'; // Chemin corrigé
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCarrot, 
    faLeaf, 
    faPepperHot, 
    faAppleAlt, 
    faMortarPestle, 
    faEgg 
} from '@fortawesome/free-solid-svg-icons'; 

// L'URL de votre API Django
const API_URL = 'http://localhost:8000/produits/api/produits/'; 

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Appel à l'API Django lors du premier rendu du composant
    axios.get(API_URL)
      .then(response => {
        // Stocke les données de l'API dans l'état 'products'
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des produits :", err);
        // Souvent une erreur CORS ou API 404/500
        setError("Impossible de charger les produits. Veuillez vérifier que le serveur Django est en cours d'exécution et que CORS est configuré.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-xl font-semibold text-blue-600">Chargement des produits...</div>;
  if (error) return <div className="p-8 text-center text-xl font-semibold text-red-600 border-2 border-red-200 bg-red-50 rounded-lg max-w-lg mx-auto">{error}</div>;
  if (products.length === 0) return <div className="p-8 text-center text-gray-500">Aucun produit trouvé dans la base de données Django.</div>;


  return (
        <div className="min-h-screen bg-yellow-50/50"> {/* Retirer le padding 'p-6' ici */}
            
            {/* AJOUT DE LA NAVIGATION */}
            <Navbar />
            
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* 1. SECTION BANNIÈRE/HÉROS */}
                <div className="relative bg-green-600 text-white p-12 md:p-20 rounded-xl mb-12 shadow-2xl overflow-hidden">
                    <div className="max-w-4xl z-10 relative">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                            Maraîchage et Épicerie Fine.
                        </h1>
                        <p className="text-xl mb-6 font-light">
                            Retrouvez le meilleur du terroir local et des produits frais, livrés avec soin.
                        </p>
                        <a href="#" className="inline-block px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition-colors">
                            Découvrir Maintenant
                        </a>
                    </div>
                    {/* Espace pour l'illustration 3D */}
                    <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
                        <img src="/static/images/maraichage_hero.png" alt="Illustration" className="w-full h-full object-cover opacity-70" />
                    </div>
                </div>
                
                {/* 2. SECTION CATÉGORIES */}
                <section className="mb-12">
                    {/* ... */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {/* 🚨 Passez les objets icônes (faCarrot, etc.) au lieu des chaînes de caractères */}
                        <CategoryCard icon={faCarrot} name="Légumes Racines" color="orange" />
                        <CategoryCard icon={faLeaf} name="Feuillages" color="green" />
                        <CategoryCard icon={faPepperHot} name="Piments & Épices" color="red" />
                        <CategoryCard icon={faAppleAlt} name="Fruits Exotiques" color="lime" />
                        <CategoryCard icon={faMortarPestle} name="Céréales" color="yellow" />
                        <CategoryCard icon={faEgg} name="Produits Laitiers" color="blue" />
                    </div>
                </section>

                {/* 3. SECTION PRODUITS */}
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 border-b pb-4">Notre Sélection Maraîchage</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"> 
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
            
            {/* AJOUT DU FOOTER */}
            <Footer />
            
        </div>
    );
}

export default App;

// Composant Helper pour les catégories (à créer dans components/CategoryCard.jsx)
const CategoryCard = ({ icon, name, color }) => (
    <div className="bg-white p-4 rounded-xl text-center shadow hover:shadow-lg transition">
        {/* 🚨 Utilisez le composant FontAwesomeIcon */}
        <FontAwesomeIcon 
            icon={icon} 
            className={`text-${color}-500 mb-2`} 
            size="2x" // Utilisez la propriété 'size' au lieu de la classe 'fa-2x'
        />
        <p className="font-semibold text-sm">{name}</p>
    </div>
);
