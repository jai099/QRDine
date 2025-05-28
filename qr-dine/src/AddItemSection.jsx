import React from "react";
import "./CartPage.css";

export default function AddItemSection({ menuItems, addItemId, setAddItemId, onAddItem }) {
  return (
    <div className="cartpage-additem-row">
      <span className="cartpage-additem-label">Add More Items:</span>
      <select
        value={addItemId}
        onChange={e => setAddItemId(e.target.value)}
        className="cartpage-additem-select"
      >
        {menuItems.map(item => (
          <option key={item.id} value={item.id}>
            {item.name} (₹{item.price})
          </option>
        ))}
      </select>
      <button
        className="cartpage-additem-btn"
        onClick={onAddItem}
      >
        Add
      </button>
    </div>
  );
}
