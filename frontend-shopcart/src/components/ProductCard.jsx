// src/components/ProductCard.jsx (CODE CORRIGÉ)
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast'; // Supposons que 'showToast' est exposé par 'useToast'
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    // 💡 Utilisez la fonction addToCart fournie par votre contexte
    const { addToCart } = useCart(); 
    const { showToast } = useToast();
    
    const name = product.nom || "Produit Maraîcher";
    const price = product.prix_actuel || 0.00; 
    const image = product.image_url || 'https://placehold.co/400x300/22c55e/ffffff?text=Image';
    const navigate = useNavigate();
    
    // 🔥 FONCTION CORRIGÉE : Appelle addToCart du contexte
    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            // L'appel à cette fonction se connecte à l'API ET met à jour l'état React via fetchCart()
            const result = await addToCart(product, 1); 
            
            if (result.success) {
                showToast(result.message);
            } else {
                 showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Erreur panier:', error);
            showToast('Erreur lors de l\'ajout au panier.', 'error');
        } finally {
            setIsAdding(false);
        }
    };
    // ... Reste du code du composant ...

    const renderStars = (rating) => {
        // ... (Votre fonction reste inchangée) ...
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

    const handleCardClick = () => {
    navigate(`/produits/${product.id}`); 
    };    


    return (
        <div className="group bg-white !pb-2 rounded-none shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full w-full min-w-[250px]"
            onClick={handleCardClick}
        >
            
            {/* Image Container et Bouton Favoris inchangés */}
            <div className="relative bg-gray-50 overflow-hidden h-56">
                <img 
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
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
            <div className="px-5 !py-4 flex flex-col flex-grow">
                
                {/* Titre */}
                <h3 className="text-xl font-bold text-gray-800 !mb-1 line-clamp-1">
                    {name}
                </h3>
                
                {/* Étoiles */}
                <div className="flex items-center gap-1 !mb-2">
                    <div className="flex">
                        {renderStars(5)}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(121)</span>
                </div>
                
                {/* Prix */}
                <div className="!mt-auto mb-4">
                    <p className="text-2xl font-bold text-black-600 !mb-4">
                        {parseFloat(price).toFixed(2)} F CFA
                    </p>
                    
                    {/* Bouton Ajouter au Panier */}
                    <button 
                        onClick={(e) => {
                            // 🔥 ÉTAPE CRUCIALE : Empêche le clic de remonter jusqu'à la carte parente
                            e.stopPropagation(); 
                            handleAddToCart();
                        }}
                        disabled={isAdding}
                        className="w-full sm:w-auto !px-2 !py-2 !ml-2 text-base font-semibold bg-white text-black border border-black rounded-lg 
                                hover:bg-green-500 hover:text-white hover:border-green-500 
                                transition-all duration-200 shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAdding ? 'Ajout...' : 'Ajouter au Panier'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;