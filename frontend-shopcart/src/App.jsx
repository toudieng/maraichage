// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import { useCart } from './context/CartContext';
import { ToastContainer, useToast } from './components/Toast';

// L'URL de votre API Django
const API_URL = 'http://localhost:8000/produits/api/produits/'; 

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getTotalItems } = useCart();
  const { toasts } = useToast();

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
      
      {/* NAVBAR */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <span className="text-white font-bold text-2xl">🌱</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Natal Mbey</h1>
                <p className="text-sm text-gray-500">Produits maraîchers frais du Sénégal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="/panier" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SECTION HÉROS */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-500 text-white p-12 md:p-20 rounded-2xl mb-12 shadow-2xl overflow-hidden">
          <div className="max-w-4xl z-10 relative">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Maraîchage et Épicerie Fine
            </h2>
            <p className="text-xl mb-6 font-light">
              Retrouvez le meilleur du terroir local et des produits frais, livrés avec soin.
            </p>
            <button className="inline-block px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition-colors">
              Découvrir Maintenant
            </button>
          </div>
          {/* Motif décoratif */}
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
            <div className="text-9xl">🥕🌿🌶️</div>
          </div>
        </div>

        {/* CATÉGORIES */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Nos Catégories</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <CategoryCard emoji="🥕" name="Légumes Racines" />
            <CategoryCard emoji="🌿" name="Feuillages" />
            <CategoryCard emoji="🌶️" name="Piments & Épices" />
            <CategoryCard emoji="🍋" name="Fruits Exotiques" />
            <CategoryCard emoji="🌾" name="Céréales" />
            <CategoryCard emoji="🥛" name="Produits Laitiers" />
          </div>
        </section>

        {/* BARRE DE RECHERCHE */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un produit (tomate, oignon, piment...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-700"
            />
          </div>
        </div>

        {/* SECTION PRODUITS */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            Nos Produits Frais
            <span className="text-green-600">({filteredProducts.length})</span>
          </h2>
          <p className="text-gray-600 mt-2">Cultivés localement à Ross Béthio, Dagana</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl font-semibold">Aucun produit trouvé</p>
            <p className="text-gray-400 mt-2">Essayez de modifier votre recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20 py-12 border-t-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-3">🌱 Natal Mbey - Maraîchage Moderne</h3>
            <p className="text-gray-300 text-lg">Ross Béthio, Dagana - Sénégal</p>
            <p className="text-green-400 font-semibold mt-2 text-lg">📞 Tel: 78 587 41 10</p>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">© 2024 Projet Natal Mbey - Tous droits réservés</p>
            </div>
          </div>
        </div>
      </footer>
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