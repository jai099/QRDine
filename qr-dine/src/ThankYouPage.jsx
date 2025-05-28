import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ThankYouPage.css";

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const table = location.state?.table || 12;

  return (
    <div className="thankyou-bg">
      <div className="thankyou-card">
        <div className="thankyou-anim">🎉</div>
        <div className="thankyou-title">Order placed successfully for Table #{table}!</div>
        <div className="thankyou-sub">Thank you for dining with us. Our chef is preparing your order! 👨‍🍳</div>
        <div className="thankyou-actions">
          <button className="thankyou-btn" onClick={() => navigate("/")}>Place Another Order</button>
          <button className="thankyou-btn secondary" onClick={() => alert('Order tracking coming soon!')}>Track Order</button>
        </div>
      </div>
    </div>
  );
}
