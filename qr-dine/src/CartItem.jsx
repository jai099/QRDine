import React from "react";
import "./CartPage.css";

export default function CartItem({ item, onQuantityChange, onDelete }) {
  return (
    <div className="cartitem-row">
      <div className="cartitem-name">{item.name}</div>
      <div className="cartitem-qty-controls">
        <button
          className="cartitem-qty-btn cartitem-qty-minus"
          onClick={() => onQuantityChange(item.id, -1)}
          aria-label="Decrease quantity"
        >−</button>
        <span className="cartitem-qty">{item.quantity}</span>
        <button
          className="cartitem-qty-btn cartitem-qty-plus"
          onClick={() => onQuantityChange(item.id, 1)}
          aria-label="Increase quantity"
        >+</button>
      </div>
      <div className="cartitem-price">₹{(item.price * item.quantity).toFixed(2)}</div>
      <button
        className="cartitem-delete-btn"
        onClick={() => onDelete(item.id)}
        aria-label="Delete item"
        title="Remove item"
      >
        &#128465;
      </button>
    </div>
  );
}
