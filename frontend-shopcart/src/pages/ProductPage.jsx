// pages/ProductPages.jsx
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { ToastContainer, useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import im2 from '../assets/im2.jpg'; 

// L'URL de votre API Django
const API_URL = 'http://localhost:8000/produits/api/produits/'; 

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getTotalItems } = useCart();
  const { toasts } = useToast();

  const navigate = useNavigate();

  const heroImage = im2; 

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Déconnexion réussie');
        navigate('/connexion');
      } else {
        alert('Erreur lors de la déconnexion');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur serveur');
    }
  };


  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des produits :", err);
        setError("Impossible de charger les produits. Veuillez vérifier que le serveur Django est en cours d'exécution.");
        setLoading(false);
      });
  }, []);

  // Filtrer les produits par recherche
  const filteredProducts = products.filter(product =>
    product.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50">
        <div className="bg-white border-2 border-red-300 rounded-2xl p-8 shadow-xl max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 font-bold text-xl mb-2">Erreur de chargement</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      
      <Navbar />

      {/* SECTION HERO - Prend TOUTE la largeur de l'écran 
        Les paddings horizontaux sont gérés à l'intérieur pour le centrage du TEXTE 
      */}
      <div 
        className="relative bg-cover bg-center h-[500px] mt-5 text-white py-20 md:p-20 mb-12 shadow-2xl overflow-hidden flex items-center justify-center w-full"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})` }}
      >
        <div className="max-w-4xl z-10 relative text-center px-4 sm:px-6 lg:px-8"> {/* Ajout de paddings ici pour que le texte ne touche pas les bords sur mobile */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Maraîchage et Épicerie Fine
          </h2>

          <div className="h-10"></div>

          <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md">
            "Contribuer au développement de l'économie sénégalaise en qualité et en quantité."
          </p>

          <div className="h-10"></div>

          <p className="text-xl mb-6 font-light">
            Retrouvez le meilleur du terroir local et des produits frais, livrés avec soin.
          </p>

        </div>
      </div>
      
      {/* CONTENU PRINCIPAL - Prend une largeur limitée et est centré 
        (C'est ici que vos produits seront limités et auront des paddings) 
      */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"> 

        <div className="h-10"></div>

        {/* SECTION PRODUITS */}
        <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 flex justify-center gap-2">
                Nos Produits Frais
            </h2>
            <p className="text-gray-600 !mt-2">Cultivés localement à Ross Béthio, Dagana</p>
        </div>

        <div className="h-10"></div>
          
          <div className="flex justify-center mx-auto">
            {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md mx-4 sm:mx-0">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-xl font-semibold">Aucun produit trouvé</p>
              <p className="text-gray-400 mt-2">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        
      </main>

      <div className="h-5"></div>

      <Footer />
    </div>
  );
}

// Composant CategoryCard simplifié (sans FontAwesome)
const CategoryCard = ({ emoji, name }) => (
  <div className="bg-white p-4 rounded-xl text-center shadow hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-100">
    <div className="text-4xl mb-2">{emoji}</div>
    <p className="font-semibold text-sm text-gray-700">{name}</p>
  </div>
);

export default App;