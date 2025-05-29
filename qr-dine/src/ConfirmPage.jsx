import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
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
  // GST and taxes (Indian):
  // CGST: 2.5%, SGST: 2.5%, Service Charge: 5%
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + cgst + sgst + serviceCharge;

  function handleConfirm() {
    // Save order to chefOrders in localStorage
    const chefOrders = JSON.parse(localStorage.getItem('chefOrders') || '[]');
    chefOrders.push({
      id: Date.now(),
      table: tableNumber,
      items: cart,
      notes: orderNotes,
      total: total,
    });
    localStorage.setItem('chefOrders', JSON.stringify(chefOrders));
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/thank-you", { state: { table: tableNumber } });
    }, 1200);
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("QRDine Bill Receipt", 14, 16);
    doc.setFontSize(12);
    let y = 28;
    doc.text(`Table: #${tableNumber}`, 14, y);
    y += 8;
    doc.text("Items:", 14, y);
    y += 8;
    cart.forEach((item) => {
      doc.text(
        `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`,
        16,
        y
      );
      y += 7;
    });
    y += 4;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`CGST (2.5%): ₹${cgst.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`SGST (2.5%): ₹${sgst.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Service Charge (5%): ₹${serviceCharge.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, y);
    y += 10;
    doc.text("Thank you for dining with us!", 14, y);
    doc.save("QRDine_Bill.pdf");
  };

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
            <div className="confirm-item-row" key={item.name}>
              <span className="confirm-item-name">{item.name}</span>
              <span className="confirm-item-qty">x{item.quantity}</span>
              <span className="confirm-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="confirm-bill-summary">
          <div className="confirm-bill-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="confirm-bill-row"><span>CGST (2.5%)</span><span>₹{cgst.toFixed(2)}</span></div>
          <div className="confirm-bill-row"><span>SGST (2.5%)</span><span>₹{sgst.toFixed(2)}</span></div>
          <div className="confirm-bill-row"><span>Service Charge (5%)</span><span>₹{serviceCharge.toFixed(2)}</span></div>
          <div className="confirm-bill-row total"><span><b>Total</b></span><span><b>₹{total.toFixed(2)}</b></span></div>
        </div>
        <button
          className="confirm-download-btn"
          style={{ marginTop: 16, width: "100%" }}
          onClick={handleDownloadPDF}
          disabled={cart.length === 0}
        >
          Download Bill as PDF
        </button>
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
          <span>₹{total.toFixed(2)}</span>
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
