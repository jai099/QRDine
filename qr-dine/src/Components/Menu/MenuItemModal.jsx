import React from 'react';

export default function MenuItemModal({ selectedItem, onClose }) {
  if (!selectedItem) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] animate-fadeInModal"
      onClick={onClose}
    >
      <div
        className="bg-warm-100 rounded-[18px] p-9 min-w-[280px] max-w-[90vw] shadow-[0_4px_32px_#ff9800cc] text-center animate-popIn 2xl:p-9 xl:p-7 md:p-4.5 sm:p-2.5 sm:min-w-[120px]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-orange-600 mb-4 md:text-xl sm:text-lg">
          {selectedItem.name}
        </h2>
        <p className="text-base text-gray-700 mb-4 md:text-sm sm:text-sm">
          {selectedItem.description}
        </p>
        <p className="text-base mb-4 md:text-sm sm:text-sm">
          <strong>Availability:</strong>{' '}
          {selectedItem.isAvailable ? 'Available' : 'Not Available'}
        </p>
        {selectedItem.addons && selectedItem.addons.length > 0 && (
          <div className="text-base mb-4 md:text-sm sm:text-sm">
            <strong>Add-ons:</strong> {selectedItem.addons.join(', ')}
          </div>
        )}
        <button
          className="mt-4 bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-lg px-5 py-2 text-base font-bold cursor-pointer transition-all duration-200 hover:bg-[#c95d0c] hover:scale-105 md:text-sm sm:text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
