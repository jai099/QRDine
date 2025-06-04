import React from "react";
import CartItem from "./CartItem.jsx";
import "./CartPage.css";
import jsPDF from "jspdf";

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

  // GST and taxes (Indian):
  // CGST: 2.5%, SGST: 2.5%, Service Charge: 5%
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + cgst + sgst + serviceCharge;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("QRDine Bill Receipt", 14, 16);
    doc.setFontSize(12);
    let y = 28;
    doc.text("Items:", 14, y);
    y += 8;
    cart.forEach((item) => {
      doc.text(
        `${item.name} x${item.qty} - ₹${(item.price * item.qty).toFixed(2)}`,
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
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="cartpage-total-row sticky">
          <span>CGST (2.5%)</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="cartpage-total-row sticky">
          <span>SGST (2.5%)</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
        <div className="cartpage-total-row sticky">
          <span>Service Charge (5%)</span>
          <span>₹{serviceCharge.toFixed(2)}</span>
        </div>
        <div className="cartpage-total-row sticky">
          <span>
            <b>Total</b>
          </span>
          <span>
            <b>₹{total.toFixed(2)}</b>
          </span>
        </div>
        <button
          className="cartpage-checkout-btn sticky"
          onMouseOver={(e) => e.currentTarget.classList.add("glow")}
          onMouseOut={(e) => e.currentTarget.classList.remove("glow")}
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
        </button>
        <button
          className="cartpage-download-btn"
          style={{ marginTop: 10, width: "100%" }}
          onClick={handleDownloadPDF}
          disabled={cart.length === 0}
        >
          Download Bill as PDF
        </button>
      </div>
    </div>
  );
}
