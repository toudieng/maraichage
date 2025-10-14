// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/panier/`, {
        withCredentials: true,
      });
      setCartItems(response.data.panier || []); // ✅ correction ici
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(localCart);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      await axios.post(
        `${API_BASE_URL}/panier/add/`,
        { produit_id: product.id, quantite: quantity },
        { withCredentials: true }
      );
      await fetchCart();
      return { success: true, message: 'Produit ajouté au panier !' };
    } catch (error) {
      console.error('Erreur API, utilisation du localStorage:', error);
      const existingItem = cartItems.find(item => item.product.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = cartItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...cartItems, { product, quantity }];
      }
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { success: true, message: 'Produit ajouté (mode hors ligne)' };
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(itemId);
    try {
      await axios.put(
        `${API_BASE_URL}/panier/update/`,
        { item_id: itemId, quantite: newQuantity },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/panier/remove/${itemId}/`, {
        withCredentials: true,
      });
      await fetchCart();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${API_BASE_URL}/panier/clear/`, {}, {
        withCredentials: true,
      });
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Erreur lors du vidage:', error);
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.prix_unitaire || 0;
      return total + (price * item.quantite);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantite, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
