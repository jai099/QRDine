import React from "react";

export default function AddItemSection({ menuItems, addItemId, setAddItemId, onAddItem }) {
  return (
    <div className="mt-9 pt-4 border-t-2 border-amber-300 flex items-center gap-4">
      <span className="font-bold text-orange-500 text-lg">Add More Items:</span>
      <select
        value={addItemId}
        onChange={(e) => setAddItemId(e.target.value)}
        className="px-4 py-2 rounded-lg border-[1.5px] border-amber-300 text-orange-600 bg-warm-50 font-semibold text-base"
      >
        {menuItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} (₹{item.price})
          </option>
        ))}
      </select>
      <button
        className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-lg font-bold text-base px-5 py-2 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.12)] hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-200 transition-all duration-200"
        onClick={onAddItem}
      >
        Add
      </button>
    </div>
  );
}