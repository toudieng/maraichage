// src/pages/Panier.jsx
import { useCart } from '../context/CartContext';

const Panier = () => {
  const { cartItems, getTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Votre Panier</h2>

      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.product.nom}</p>
                  <p className="text-sm text-gray-500">
                    {item.product.prix_actuel} € x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 ml-4">🗑️</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total : {getTotal().toFixed(2)} €</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Panier;
