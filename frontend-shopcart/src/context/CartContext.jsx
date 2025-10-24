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

      const rawCartItems = response.data.panier || [];

      // 🧩 Normalisation
      const standardizedCart = rawCartItems.map((item) => {
        if (item.product) {
          return {
            ...item,
            nom: item.product.nom || item.nom || 'Produit inconnu',
            prix_unitaire: item.product.prix_unitaire || item.prix_unitaire || 0,
          };
        }

        return {
          ...item,
          product: {
            id: item.produit_id || item.id || null,
            nom: item.nom || 'Produit inconnu',
            prix_unitaire: item.prix_unitaire || 0,
            image: item.image || null,
          },
          nom: item.nom || 'Produit inconnu',
        };
      });

      // 🔥 Tri stable ici (ordre constant selon ID du panier ou du produit)
      const sortedCart = standardizedCart.sort(
        (a, b) => (a.id ?? a.product.id) - (b.id ?? b.product.id)
      );

      setCartItems(sortedCart);
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
      const existingItem = cartItems.find((item) => item.product.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantite: item.quantite + quantity }
            : item
        );
      } else {
        updatedCart = [...cartItems, { product, quantite: quantity }];
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

      // ✅ Met à jour localement sans refetch pour garder l’ordre
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantite: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/panier/remove/`,
        { item_id: cartItemId },
        { withCredentials: true }
      );

      // ✅ Supprime localement sans refetch
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${API_BASE_URL}/panier/clear/`, {}, { withCredentials: true });
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Erreur lors du vidage:', error);
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  const getTotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.prix_unitaire || 0;
      return total + price * item.quantite;
    }, 0);

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantite, 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
