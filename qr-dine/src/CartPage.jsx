import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import AddItemSection from "./AddItemSection";
import "./CartPage.css";

// Predefined menu for adding more items
const menuItems = [
  { id: 4, name: "Butter Naan", price: 40 },
  { id: 5, name: "Gulab Jamun", price: 60 },
  { id: 6, name: "Tandoori Chicken", price: 250 },
  { id: 7, name: "Veg Pulao", price: 120 },
  { id: 8, name: "Samosa", price: 30 }
];

const initialCartItems = [
  { id: 1, name: "Paneer Butter Masala", price: 220, quantity: 2 },
  { id: 2, name: "Masala Dosa", price: 90, quantity: 1 },
  { id: 3, name: "Chicken Biryani", price: 180, quantity: 1 }
];

function getStoredCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cartItems'));
    if (Array.isArray(cart)) return cart;
  } catch {}
  return initialCartItems;
}

export default function CartPage({ onCartChange, onProceedToCheckout }) {
  const [cartItems, setCartItems] = useState(getStoredCart());
  const [addItemId, setAddItemId] = useState(menuItems[0].id);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (onCartChange) onCartChange();
    // Also trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  }, [cartItems, onCartChange]);

  const handleQuantityChange = (id, delta) => {
    setCartItems(items =>
      items
        .map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleDelete = id => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    const menuItem = menuItems.find(item => item.id === Number(addItemId));
    setCartItems(items => {
      const exists = items.find(i => i.id === menuItem.id);
      if (exists) {
        return items.map(i =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...menuItem, quantity: 1 }];
    });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cartpage-bg">
      <div className="cartpage-container">
        <h2 className="cartpage-title">Your Cart</h2>
        <div>
          {cartItems.length === 0 ? (
            <div className="cartpage-empty">Your cart is empty!</div>
          ) : (
            cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
        <AddItemSection
          menuItems={menuItems}
          addItemId={addItemId}
          setAddItemId={setAddItemId}
          onAddItem={handleAddItem}
        />
      </div>
      <div className="cartpage-sticky-checkout">
        <div className="cartpage-total-row sticky">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button
          className="cartpage-checkout-btn sticky"
          onMouseOver={e => e.currentTarget.classList.add("glow")}
          onMouseOut={e => e.currentTarget.classList.remove("glow")}
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
