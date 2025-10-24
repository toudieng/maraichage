// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext'; 

const API_BASE_URL = 'http://localhost:8000/produits/api/produits';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // État pour le compteur de quantité

  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;

    axios.get(`${API_BASE_URL}/${productId}/`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération du produit:", err);
        setError("Impossible de charger les détails du produit.");
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div className="text-center py-20">Chargement des détails...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-20">Produit non trouvé.</div>;

  // Récupération sécurisée des données
  const currentPrice = product.prix_actuel || 0;
  const imageUrl = product.image_url;
  
  // Fonction pour gérer l'ajout au panier (à implémenter)
  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log(`Ajout de ${quantity}x ${product.nom} au panier.`);
  };

  const handleQuantityChange = (e) => {
    // 1. Convertir la valeur en nombre entier
    let value = parseInt(e.target.value, 10); 
    
    // 2. S'assurer que la valeur est un nombre valide et >= 1
    if (isNaN(value) || value < 1) {
        value = 1; 
    }
    
    // 3. Mettre à jour l'état
    setQuantity(value);
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* 📦 CONTENEUR PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* FIL D'ARIANE (Breadcrumbs) - Comme dans l'exemple */}
        <div className="text-sm text-gray-500 mb-6">
             <a href="/produits" className="hover:text-green-600">Nos produits</a> &gt; {product.nom}
        </div>

        <div className="bg-white p-6 md:p-10 shadow-lg rounded-xl flex flex-col md:flex-row gap-10">
            
            {/* 🖼️ BLOC 1 : IMAGE ET MINIATURES */}
            <div className="md:w-1/2 flex flex-col items-center">
                {/* Image Principale */}
                <div className="w-full max-w-lg h-96 bg-gray-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={product.nom}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-500">Image du Produit</span>
                    )}
                </div>
                
                {/* Miniatures (à implémenter si vous avez plusieurs images) */}
                {/* <div className="flex space-x-2"> */}
                    {/* Placeholder pour les miniatures */}
                    {/* <div className="w-16 h-16 border border-green-500 p-1 rounded-md bg-gray-100 cursor-pointer"></div>
                    <div className="w-16 h-16 border border-gray-200 p-1 rounded-md bg-gray-100 cursor-pointer"></div>
                    <div className="w-16 h-16 border border-gray-200 p-1 rounded-md bg-gray-100 cursor-pointer"></div>
                </div> */}
            </div>

            {/* 📝 BLOC 2 : DÉTAILS ET INTERACTION */}
            <div className="md:w-1/2 pt-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                    {product.nom}
                </h1>
                
                {/* Description courte / Slogan */}
                <p className="text-lg text-gray-600 mb-6">
                    Produit frais et local, livré directement de la ferme.
                </p>
                
                {/* Prix */}
                <p className="text-4xl font-bold text-gray-900 !mb-8 border-b !pb-4 border-gray-300">
                    {/* Utilise toFixed(0) pour ne pas afficher 00 F CFA si le prix est entier */}
                    {currentPrice ? `${parseFloat(currentPrice).toFixed(0)} F CFA` : 'Prix Indisponible'}
                </p>

                {/* 1. Bloc de contrôle de quantité (nouvellement séparé) */}
                <div className="flex items-center space-x-4 !mb-4">
                    <span className="text-gray-700 font-medium !mr-5">Quantité  :</span>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <button 
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-4 py-2 text-xl font-semibold text-gray-600 hover:bg-gray-100 transition"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange} // Utilisation de la nouvelle fonction
                            min="1" // Empêche le navigateur de descendre sous 1 (en plus de la logique JS)
                            className="w-16 text-center text-lg border-l border-r border-gray-300 focus:outline-none"
                            style={{ appearance: 'none' }} // Retire les flèches du navigateur (pour un meilleur style)
                        />
                        <button 
                            onClick={() => setQuantity(q => q + 1)}
                            className="px-4 py-2 text-xl font-semibold text-gray-600 hover:bg-gray-100 transition"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* 2. Bloc du bouton d'action (nouvellement séparé) */}
                <div className="!mb-8">
                    <button
                        onClick={handleAddToCart}
                        className="w-50 !py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Ajouter au panier
                    </button>
                </div>
                
                {/* Caractéristiques/Promotions */}
                <div className="mt-8 border-t pt-6 border-gray-300">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Détails du produit</h3>
                    <p className="text-gray-600 mb-4">{product.description || "Aucune description détaillée n'est disponible pour ce produit."}</p>
                    
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-center">
                            <span className="text-green-500 mr-2">✅</span> Livraison sécurisée.
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-500 mr-2">♻️</span> Produit issu de l'agriculture locale.
                        </li>
                        <li className="flex items-center">
                            <span className="text-red-500 mr-2">⏰</span> Stock limité.
                        </li>
                    </ul>
                </div>

            </div> {/* Fin du bloc Détails */}
        </div> {/* Fin de la grille principale */}
        
        {/* SECTION CARACTÉRISTIQUES SUPPLÉMENTAIRES (Comme dans l'exemple original) */}
        <div className="mt-16 bg-white p-8 shadow-lg rounded-xl">
             <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Spécifications et Informations</h2>
             <p className="text-gray-600">
                 Détails sur l'origine (Ross Béthio, Dagana), les bienfaits pour la santé, et les conseils de conservation.
             </p>
             {/* Vous pouvez ajouter ici un tableau ou des listes de spécifications */}
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;