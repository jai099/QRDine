import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ConfirmPage.css";

// Dummy data for demo
const getCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cartItems"));
    if (Array.isArray(cart)) {
      // Normalize cart items to ensure price is a number and quantity is correct
      return cart.map(item => ({
        ...item,
        price: Number(item.price),
        quantity: item.qty || item.quantity || 1
      }));
    }
  } catch {}
  return [];
};

export default function ConfirmPage() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [tip, setTip] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const tableNumber = 12; // Example, could be dynamic
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tipAmount = (total * tip) / 100;
  const grandTotal = total + tipAmount;

  function handleConfirm() {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/thank-you", { state: { table: tableNumber } });
    }, 1200);
  }

  return (
    <div className="confirm-split-layout">
      {/* Left: Order Summary */}
      <div className="confirm-left">
        <div className="confirm-title">📋 Order Summary</div>
        <div className="confirm-table-row">
          <span className="confirm-table-label">Table</span>
          <span className="confirm-table-value">#{tableNumber}</span>
        </div>
        <div className="confirm-items-list">
          {cart.map(item => (
            <div className="confirm-item-card" key={item.id}>
              <div className="confirm-item-img">
                <span role="img" aria-label="food">🍽️</span>
              </div>
              <div className="confirm-item-info">
                <div className="confirm-item-name">{item.name}</div>
                <div className="confirm-item-details">
                  <span className="confirm-item-qty">x{item.quantity}</span>
                  <span className="confirm-item-price">₹{item.price}</span>
                </div>
                {item.notes && <div className="confirm-item-notes">📝 {item.notes}</div>}
              </div>
              <div className="confirm-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="confirm-summary-row">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button className="confirm-edit-btn" onClick={() => navigate("/")}>← Edit Order</button>
      </div>
      {/* Right: Confirm & Submit */}
      <div className="confirm-right">
        <div className="confirm-title">✍️ Confirm & Submit</div>
        <div className="confirm-form-group">
          <label>Customer Name (optional)</label>
          <input
            className="confirm-input"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="confirm-form-group">
          <label>Order Notes (optional)</label>
          <textarea
            className="confirm-input"
            value={orderNotes}
            onChange={e => setOrderNotes(e.target.value)}
            placeholder="e.g. No onions please"
            rows={2}
          />
        </div>
        <div className="confirm-form-group">
          <label>Tip</label>
          <div className="confirm-tip-row">
            {[0, 5, 10, 15].map(val => (
              <button
                key={val}
                className={`confirm-tip-btn${tip === val ? " selected" : ""}`}
                onClick={() => setTip(val)}
                type="button"
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
        <div className="confirm-summary-row grand">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
        <button
          className="confirm-place-btn"
          onClick={handleConfirm}
        >
          🟢 Place Order
        </button>
        {showToast && <div className="confirm-toast">Order Confirmed! 👨‍🍳</div>}
      </div>
    </div>
  );
}
