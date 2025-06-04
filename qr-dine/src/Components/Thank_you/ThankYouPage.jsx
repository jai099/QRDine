import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const table = location.state?.table || 12;

  // Reset cart and menu state on mount
  React.useEffect(() => {
    localStorage.removeItem('cartItems');
    // Optionally, clear other localStorage keys if needed
    // localStorage.removeItem('menuData');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-warm-300 to-warm-200 flex items-center justify-center font-sans">
      <div className="bg-warm-100 rounded-3xl shadow-[0_4px_32px_rgba(255,152,0,0.13)] p-12 flex flex-col items-center max-w-[420px] w-full animate-thankyouPop sm:p-7 sm:pb-4.5 sm:max-w-[98vw]">
        <div className="text-6xl mb-4.5 animate-thankyouBounce">🎉</div>
        <div className="text-2xl font-extrabold text-orange-500 mb-2.5 text-center tracking-widest">
          Order placed successfully for Table #{table}!
        </div>
        <div className="text-lg text-orange-600 mb-7 text-center">
          Thank you for dining with us. Our chef is preparing your order! 👨‍🍳
        </div>
        <div className="flex gap-4 w-full justify-center">
          <button
            className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-[10px] font-bold text-lg py-3 px-5.5 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.10)] transition-all duration-200 hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc]"
            onClick={() => navigate("/")}
          >
            Place Another Order
          </button>
          <button
            className="bg-warm-200 text-orange-600 border-none rounded-[10px] font-bold text-lg py-3 px-5.5 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.10)] transition-all duration-200 hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc]"
            onClick={() => alert('Order tracking coming soon!')}
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}