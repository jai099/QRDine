import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Menu from './Menu';
import CartPage from './CartPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ConfirmPage from './ConfirmPage';
import ThankYouPage from './ThankYouPage';

function getCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cartItems'));
    if (Array.isArray(cart)) {
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  } catch {}
  return 4; // fallback for initial render
}

function App() {
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const navigate = useNavigate();

  useEffect(() => {
    function handleStorage() {
      setCartCount(getCartCount());
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function handleCartOpen() {
    setShowCart(true);
    setTimeout(() => setCartCount(getCartCount()), 200);
  }

  function handleCartClose() {
    setShowCart(false);
    setTimeout(() => setCartCount(getCartCount()), 200);
  }

  function handleProceedToCheckout() {
    setShowCart(false);
    setTimeout(() => {
      setCartCount(getCartCount());
      navigate('/confirm');
    }, 200);
  }

  return (
    <Routes>
      <Route path="/" element={
        <div className="App frontpage-bg">
          <Menu />
          {/* Floating Cart Icon */}
          <button
            className={`floating-cart-btn${showCart ? " hide" : ""}`}
            onClick={handleCartOpen}
            aria-label="View Cart"
          >
            <span className="cart-icon-anim">
              <svg width="32" height="32" fill="none" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </span>
            <span className="cart-count-badge">{cartCount}</span>
          </button>

          {/* Slide-in Cart Panel */}
          <div className={`cart-slide-overlay${showCart ? " open" : ""}`} onClick={handleCartClose} />
          <div className={`cart-slide-panel${showCart ? " open" : ""}`}>
            <button
              onClick={handleCartClose}
              className="cart-slide-close-btn"
              aria-label="Close Cart"
            >
              <svg width="28" height="28" fill="none" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
            <CartPage
              onCartChange={() => setCartCount(getCartCount())}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>

          {!showCart && (
            <main className="frontpage-main">
              <div className="frontpage-hero">
                <img src={logo} className="frontpage-logo" alt="Logo" />
              </div>
            </main>
          )}
        </div>
      } />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
}

export default App;
