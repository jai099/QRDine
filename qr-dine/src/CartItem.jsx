import React from "react";
import "./CartPage.css";

export default function CartItem({ item, onQuantityChange, onDelete }) {
  return (
    <div className="cartitem-row cartitem-row-clean">
      <div className="cartitem-info">
        <div className="cartitem-name">{item.name}</div>
        <div className="cartitem-details-row">
          <span className="cartitem-price">₹{item.price}</span>
          <div className="cartitem-qty-controls">
            <button
              className="cartitem-qty-btn cartitem-qty-minus"
              onClick={() => onQuantityChange(item.id, -1)}
              aria-label="Decrease quantity"
            >−</button>
            <span className="cartitem-qty">{item.qty}</span>
            <button
              className="cartitem-qty-btn cartitem-qty-plus"
              onClick={() => onQuantityChange(item.id, 1)}
              aria-label="Increase quantity"
            >+</button>
          </div>
        </div>
      </div>
      <div className="cartitem-totalprice">₹{(item.price * item.qty).toFixed(2)}</div>
      <button
        className="cartitem-delete-btn"
        onClick={() => onDelete(item.id)}
        aria-label="Delete item"
        title="Remove item"
      >
        <svg width="20" height="20" fill="none" stroke="#e65100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </div>
  );
}
