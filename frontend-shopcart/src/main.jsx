// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
//import App from './App.jsx'
import CartPage from './pages/CartPage.jsx'
import { CartProvider } from './context/CartContext.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CommandePage from './pages/CommandePage';
import MesCommandesPage from './pages/MesCommandesPage';
import SearchResults from './pages/SearchResults.jsx';
import ProfilPage from './pages/ProfilPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ProductDetail from './pages/ProductDetail';
import Panier from './pages/Panier';
import ContactPage from './pages/ContactPage';
import './index.css'
import 'leaflet/dist/leaflet.css';

import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <CartProvider>
          <Routes>
            {/* <Route path="/" element={<App />} /> */}
            <Route path="/panier" element={<Panier />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            <Route path="/commande/:id" element={<CommandePage />} />
            <Route path="/mes-commandes" element={<MesCommandesPage />} />
            <Route path="/recherche" element={<SearchResults />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/produits" element={<ProductPage />} />
            <Route path="/produits/:productId" element={<ProductDetail />} />
          </Routes>
        </CartProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)