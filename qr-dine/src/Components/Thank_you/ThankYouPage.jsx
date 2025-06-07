import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get table number from state, or fallback to query param, or fallback to 12
  let table = location.state?.table;
  if (!table) {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('table');
    if (t) table = parseInt(t, 10);
  }
  if (!table) table = 12;

  // Reset cart and menu state on mount
  React.useEffect(() => {
    localStorage.removeItem('cartItems');
    // Optionally, clear other localStorage keys if needed
    // localStorage.removeItem('menuData');
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans">
      <div className="bg-[#fff8ee] rounded-3xl shadow-xl p-10 flex flex-col items-center max-w-lg w-full animate-thankyouPop">
        <div className="text-6xl mb-6 animate-thankyouBounce">🎉</div>
        <div className="text-2xl font-extrabold text-orange-700 mb-3 text-center tracking-widest">
          Order placed successfully for Table #{table}!
        </div>
        <div className="text-lg text-orange-600 mb-8 text-center">
          Thank you for dining with us. Our chef is preparing your order! 👨‍🍳
        </div>
        <div className="flex gap-4 w-full justify-center">
          <button
            className="bg-gradient-to-r from-orange-500 to-amber-400 text-white border-none rounded-lg font-bold text-lg py-3 px-6 cursor-pointer shadow hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc] transition-all duration-200"
            onClick={() => navigate("/")}
          >
            Place Another Order
          </button>
          <button
            className="bg-orange-100 text-orange-700 border-none rounded-lg font-bold text-lg py-3 px-6 cursor-pointer shadow hover:bg-orange-200 transition-all duration-200"
            onClick={() => alert('Order tracking coming soon!')}
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}