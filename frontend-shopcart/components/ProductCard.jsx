import React from 'react';

const ProductCard = ({ product }) => {
    // Extrait les données de l'API Django
    const name = product.nom || "Produit Maraîcher";
    //const description = product.description || 'Description du produit disponible en boutique.';
    
    // **CORRECTION ICI : On utilise le nouveau champ 'prix_actuel' renvoyé par le Serializer Django**
    const price = product.prix_actuel || 0.00; 

    const image = product.image_url || 'https://placehold.co/400x200/4c3c3a/ffffff?text=Mara%C3%AEchage';
    
    // Fonction utilitaire pour afficher les étoiles
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 5); 
        const stars = [];
        for (let i = 0; i < 5; i++) {
            const color = i < fullStars ? "text-yellow-500" : "text-gray-300";
            stars.push(<span key={i} className={color}>★</span>);
        }
        return stars;
    };

    return (
        // Style de la carte: fond blanc, ombres, transition, bordure légère
        <div className="group bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 flex flex-col cursor-pointer">
            
            {/* Image et Icône Coeur */}
            <div className="relative flex justify-center items-center mb-4 bg-gray-50 rounded-lg h-32 md:h-40 overflow-hidden">
                <img 
                    src={image} // 🚨 AJOUTEZ LA SOURCE ICI
                    alt={name} // 🚨 AJOUTEZ L'ALT TEXTE ICI
                    className="max-h-full max-w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button className="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 transition-colors shadow-md opacity-0 group-hover:opacity-100 duration-300">
                    {/* Icône de cœur (utilisez un icône library comme Heroicons ou un SVG si possible) */}
                    ❤️ 
                </button>
            </div>

            {/* Détails du Produit */}
            <div className="text-center flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                        {/* Diminuer la taille de la police pour un look plus compact */}
                        {name}
                    </h3>
                    
                    {/* Évaluation par étoiles */}
                    <div className="flex items-center justify-center space-x-0.5 my-2">
                        {renderStars(5)}
                        {/* Retirer le (5/5) ou le mettre en taille XS si souhaité */}
                        <span className="text-xs text-gray-500 ml-1">(121)</span> 
                    </div>
                    
                    <p className="text-2xl font-bold text-green-700 mb-2">
                        {/* Prix en gras avec la bonne couleur */}
                        {parseFloat(price).toFixed(2)} € 
                    </p>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-2 invisible h-0">
                        {/* Description masquée/réduite pour imiter le style compact de la carte du modèle */}
                    </p>
                </div>
                
                {/* Bouton Ajouter au Panier */}
                <button className="mt-4 w-full py-2.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors duration-200 shadow-sm opacity-0 group-hover:opacity-100 duration-300">
                    Ajouter au Panier
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
