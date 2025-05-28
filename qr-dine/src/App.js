import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
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

  // Listen for cart changes from CartPage via storage
  React.useEffect(() => {
    function handleStorage() {
      setCartCount(getCartCount());
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // For demo: update count when cart opens/closes (in real app, lift state up)
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
          {/* Floating Cart Icon */}
          <button
            className={`floating-cart-btn${showCart ? " hide" : ""}`}
            onClick={handleCartOpen}
            aria-label="View Cart"
          >
            <span className="cart-icon-anim">
              <svg width="32" height="32" fill="none" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
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
                <path d="M18 6L6 18"/>
                <path d="M6 6l12 12"/>
              </svg>
            </button>
            <CartPage onCartChange={() => setCartCount(getCartCount())} onProceedToCheckout={handleProceedToCheckout} />
          </div>
          {!showCart && (
            <main className="frontpage-main">
              <div className="frontpage-hero">
                <img src={logo} className="frontpage-logo" alt="QRDine Logo" />
                <h1 className="frontpage-title">Welcome to QRDine 🍽️</h1>
                <p className="frontpage-desc">
                  Scan. Order. Enjoy. <span role="img" aria-label="chef">👨‍🍳</span><br/>
                  Experience seamless digital ordering for your table.<br/>
                  <span className="frontpage-highlight">Tap the cart to view or edit your order!</span>
                </p>
                <div className="frontpage-menu-section">
                  <h2 className="frontpage-menu-title">Popular Indian Dishes</h2>
                  <div className="frontpage-menu-list">
                    <div className="frontpage-menu-card"><span role="img" aria-label="Paneer">🧀</span> Paneer Butter Masala</div>
                    <div className="frontpage-menu-card"><span role="img" aria-label="Dosa">🥞</span> Masala Dosa</div>
                    <div className="frontpage-menu-card"><span role="img" aria-label="Biryani">🍛</span> Chicken Biryani</div>
                    <div className="frontpage-menu-card"><span role="img" aria-label="Naan">🍞</span> Butter Naan</div>
                    <div className="frontpage-menu-card"><span role="img" aria-label="Gulab Jamun">🍬</span> Gulab Jamun</div>
                    <div className="frontpage-menu-card"><span role="img" aria-label="Tandoori">🍗</span> Tandoori Chicken</div>
                    <div className="frontpage-menu-card"><span role="img" aria-label="Pulao">🍚</span> Veg Pulao</div>
                    <div className="frontpage-menu-card"><span role="img" aria-label="Samosa">🥟</span> Samosa</div>
                  </div>
                </div>
                <div className="frontpage-cta-row">
                  <button className="frontpage-cta-btn" onClick={handleCartOpen}>
                    View Cart &rarr;
                  </button>
                </div>
              </div>
              <footer className="frontpage-footer">
                <span>Made with <span style={{color:'#ff9800'}}>🧡</span> for Dine-in Delight</span>
              </footer>
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
