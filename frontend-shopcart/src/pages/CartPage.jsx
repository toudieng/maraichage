// src/pages/CartPage.jsx
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);

  const total = getTotal();

  const handleClearCart = () => {
    if (confirmClear) {
      clearCart();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 Votre Panier</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.produit}</p>
                  <p className="text-sm text-gray-500">
                    {item.prix_unitaire} € x {item.quantite}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantite - 1)}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span>{item.quantite}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantite + 1)}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 ml-4 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total : {total.toFixed(2)} €</p>
            <button
              onClick={handleClearCart}
              className={`px-4 py-2 rounded transition ${
                confirmClear
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {confirmClear ? 'Confirmer ?' : 'Vider le panier'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/checkout')}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              <span>Valider la commande</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
