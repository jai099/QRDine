import React from "react";

export default function CartItem({ item, onQuantityChange, onDelete }) {
  return (
    <div className="flex items-center gap-7 mb-7 pb-4 border-b border-dashed border-amber-300 bg-gradient-to-r from-warm-300 to-warm-200 rounded-2xl shadow-[0_2px_10px_rgba(255,152,0,0.07)] min-h-[72px] transition-all duration-200 hover:shadow-[0_8px_32px_#ff9800cc] hover:scale-103 hover:-translate-y-0.5 hover:z-10 animate-foodCardPop">
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="font-bold text-lg text-orange-600 tracking-tight truncate drop-shadow-[0_1px_0_#fffde7] mb-0.5">
          {item.name}
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <span className="font-semibold text-base text-green-600 bg-warm-100 px-3 py-1 rounded-lg shadow-[0_1px_2px_#ffe0b2]">
            ₹{item.price}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="border-none rounded-full w-8 h-8 text-lg font-bold cursor-pointer shadow-[0_1px_4px_#ffe0b2] bg-gradient-to-r from-orange-500 to-amber-300 text-white flex items-center justify-center transition-all duration-200 active:scale-90 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => onQuantityChange(item.id, -1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[26px] text-center font-bold text-base text-orange-500 tracking-wide">
              {item.qty}
            </span>
            <button
              className="border-none rounded-full w-8 h-8 text-lg font-bold cursor-pointer shadow-[0_1px_4px_#ffe0b2] bg-gradient-to-r from-orange-500 to-amber-300 text-white flex items-center justify-center transition-all duration-200 active:scale-90 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => onQuantityChange(item.id, 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="font-bold text-lg text-orange-700 bg-warm-100 px-4 py-2 rounded-lg shadow-[0_1px_4px_#ffe0b2] ml-2 min-w-[90px] text-right">
        ₹{(item.price * item.qty).toFixed(2)}
      </div>
      <button
        className="ml-3 bg-warm-300 border-none rounded-full w-9 h-9 text-lg text-orange-600 cursor-pointer shadow-[0_1px_4px_#ffe0b2] flex items-center justify-center transition-all duration-200 hover:bg-amber-300 hover:scale-108"
        onClick={() => onDelete(item.id)}
        aria-label="Delete item"
        title="Remove item"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="#e65100"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );
}