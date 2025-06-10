// CustomerMenuPage.jsx
import Menu from '../Menu/Menu.jsx';
import CartPage from '../Cart/CartPage.jsx';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CustomerMenuPage = () => {
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

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tableNumber = params.get('table');

  // Fix: treat tableNumber as present if it's not null (including '0')
  const hasTableNumber = tableNumber !== null && tableNumber !== undefined && tableNumber !== '';

  return (
    <div className="frontpage-bg">
      <Menu
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        decreaseQty={decreaseQty}
      />
      {/* Show cart if tableNumber is present (including 0) */}
      {hasTableNumber && (
        <>
          <button
            className={`floating-cart-btn${showCart ? " hide" : ""}`}
            onClick={handleCartOpen}
          >
            🛒
            <span className="cart-count-badge">{cart.reduce((sum, item) => sum + (item.qty || 0), 0)}</span>
          </button>
          <div className={`cart-slide-overlay${showCart ? " open" : ""}`} onClick={handleCartClose} />
          <div className={`cart-slide-panel${showCart ? " open" : ""}`}>
            <button onClick={handleCartClose} className="cart-slide-close-btn">❌</button>
            <CartPage
              cart={cart}
              setCart={setCart}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerMenuPage;
