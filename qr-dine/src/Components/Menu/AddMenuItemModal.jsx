import React, { useState } from 'react';

const CATEGORIES = ['Starters', 'Main Course', 'Drinks', 'Desserts'];

const AddMenuItemModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !category || isNaN(price)) {
      alert("Please enter valid values.");
      return;
    }

    onAdd({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category,
      isAvailable
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Add Menu Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
            required
            min="1"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={e => setIsAvailable(e.target.checked)}
            />
            <span>Available</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
