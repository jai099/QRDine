import React from "react";
import CartItem from "./CartItem";
import "./CartPage.css";

export default function CartPage({ cart, setCart, onProceedToCheckout }) {
  const handleQuantityChange = (id, delta) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleDelete = (id) => {
    setCart((items) => items.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cartpage-bg">
      <div className="cartpage-container">
        <h2 className="cartpage-title">Your Cart</h2>
        <div>
          {cart.length === 0 ? (
            <div className="cartpage-empty">Your cart is empty!</div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
      <div className="cartpage-sticky-checkout">
        <div className="cartpage-total-row sticky">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button
          className="cartpage-checkout-btn sticky"
          onMouseOver={(e) => e.currentTarget.classList.add("glow")}
          onMouseOut={(e) => e.currentTarget.classList.remove("glow")}
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
