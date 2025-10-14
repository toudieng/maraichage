// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import CartPage from './pages/CartPage.jsx'
import { CartProvider } from './context/CartContext.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import './index.css'

import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <CartProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/connexion" element={<LoginPage />} />
          </Routes>
        </CartProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)