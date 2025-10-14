// src/components/ProductCard.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';


const ProductCard = ({ product, onAddToCart }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();
    const { showToast } = useToast();
    
    const name = product.nom || "Produit Maraîcher";
    const price = product.prix_actuel || 0.00; 
    const image = product.image_url || 'https://placehold.co/400x300/22c55e/ffffff?text=Image';
    
    const handleAddToCart = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/panier/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ produit_id: product.id, quantite: 1 }),
            });
            const data = await response.json();
            if (data.success) {
            showToast('Produit ajouté au panier !');
            }
        } catch (error) {
            console.error('Erreur panier:', error);
        }
    };

    
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 5); 
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < fullStars ? "text-yellow-400" : "text-gray-300"}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            
            {/* Image Container */}
            <div className="relative bg-gray-50 overflow-hidden h-56">
                <img 
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Bouton Favoris */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
                        isFavorite 
                            ? 'bg-red-500 text-white scale-110' 
                            : 'bg-white text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100'
                    }`}
                >
                    <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                
                {/* Titre */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {name}
                </h3>
                
                {/* Étoiles */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                        {renderStars(5)}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(121)</span>
                </div>
                
                {/* Prix */}
                <div className="mt-auto">
                    <p className="text-3xl font-bold text-green-600 mb-4">
                        {parseFloat(price).toFixed(2)} €
                    </p>
                    
                    {/* Bouton Ajouter au Panier */}
                    <button 
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="w-full py-3 text-base font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAdding ? 'Ajout...' : 'Ajouter au Panier'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;