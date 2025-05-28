import React from "react";

const cartItems = [
  { id: 1, name: "Margherita Pizza", price: 8.99, quantity: 2, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Caesar Salad", price: 5.49, quantity: 1, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Spaghetti Carbonara", price: 10.99, quantity: 1, image: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?auto=format&fit=crop&w=400&q=80" }
];

const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default function CartPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      padding: "40px 0"
    }}>
      <div style={{
        maxWidth: 500,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(60,60,120,0.15)",
        padding: 32
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 32, color: "#4f46e5" }}>Your Cart</h2>
        <div>
          {cartItems.map(item => (
            <div key={item.id} style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              borderBottom: "1px solid #f1f1f1",
              paddingBottom: 16
            }}>
              <img src={item.image} alt={item.name} style={{
                width: 64, height: 64, borderRadius: 12, objectFit: "cover", marginRight: 20
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{item.name}</div>
                <div style={{ color: "#64748b", fontSize: 14 }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 32,
          fontSize: 20,
          fontWeight: 700,
          color: "#1e293b"
        }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button style={{
          width: "100%",
          marginTop: 32,
          padding: "14px 0",
          background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(99,102,241,0.15)",
          transition: "background 0.2s"
        }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
