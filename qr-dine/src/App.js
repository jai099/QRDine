import './App.css';
import Menu from './Components/Menu/Menu.jsx';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CartPage from './Components/Cart/CartPage';
import ConfirmPage from './Components/Thank_you/ConfirmPage.jsx';
import ThankYouPage from './Components/Thank_you/ThankYouPage.jsx';
import ChefDashboard from './Components/ChefDashboard/ChefDashboard';
import WaiterDashboard from './Components/waiter/WaiterDashboard';
import WebsiteQR from './Components/QR/WebsiteQR.jsx';
import TableQRList from './Components/QR/TableQRList.jsx';
import AdminLogin from './Components/Admin/AdminLogin.jsx';
import AdminRegisterForm from './Components/Admin/AdminRegisterForm.jsx';


function App() {
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cartItems'));
      return Array.isArray(storedCart) ? storedCart : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i.name === item.name && i.tableNumber === item.tableNumber);
      if (found) {
        return prev.map((i) => (i.name === item.name && i.tableNumber === item.tableNumber ? { ...i, qty: i.qty + 1 } : i));
      } else {
        return [...prev, { ...item, qty: 1, id: item.id || Date.now() }];
      }
    });
  };

  const removeFromCart = (item) => {
    setCart((prev) => prev.filter((i) => i.name !== item.name));
  };

  const decreaseQty = (item) => {
    setCart((prev) => {
      return prev
        .map((i) => (i.name === item.name ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
    });
  };

  const handleCartOpen = () => setShowCart(true);
  const handleCartClose = () => setShowCart(false);
  const handleProceedToCheckout = () => {
    setShowCart(false);
    setTimeout(() => {
      window.location.href = '/confirm';
    }, 200);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App frontpage-bg">
            <Menu
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              decreaseQty={decreaseQty}
            />
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
              <span className="cart-count-badge">{cart.reduce((sum, item) => sum + (item.qty || 0), 0)}</span>
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
                cart={cart}
                setCart={setCart}
                onProceedToCheckout={handleProceedToCheckout}
              />
            </div>
          </div>
        }
      />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/chef" element={<ChefDashboard />} />
      <Route path="/waiter" element={<WaiterDashboard />} />
      <Route path="/qr" element={<WebsiteQR url={window.location.origin} />} />
      <Route path="/qr-tables" element={<TableQRList baseUrl={window.location.origin} />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/register-staff" element={<AdminRegisterForm />} />
    </Routes>
  );
}

export default App;