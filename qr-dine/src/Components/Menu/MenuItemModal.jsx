import React from 'react';

export default function MenuItemModal({ selectedItem, onClose }) {
  if (!selectedItem) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] animate-fadeInModal"
      onClick={onClose}
    >
      <div
        className="bg-warm-100 rounded-[18px] p-9 min-w-[280px] max-w-[90vw] shadow-[0_4px_32px_#ff9800cc] text-left animate-popIn 2xl:p-9 xl:p-7 md:p-5 sm:p-4 sm:min-w-[200px] sm:text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-orange-600 mb-4 md:text-xl sm:text-lg text-center">
          {selectedItem.name}
        </h2>

        <div className="space-y-3 text-gray-800 text-base md:text-sm sm:text-sm">
          {/* Description */}
          <p>{selectedItem.description}</p>

          {/* Availability */}
          <p>
            <strong className="font-medium">Availability:</strong>{' '}
            <span
              className={
                selectedItem.isAvailable ? 'text-green-600' : 'text-red-600'
              }
            >
              {selectedItem.isAvailable ? 'Available' : 'Not Available'}
            </span>
          </p>

          {/* Add-ons */}
          {selectedItem.addons && selectedItem.addons.length > 0 && (
            <p>
              <strong className="font-medium">Add-ons:</strong>{' '}
              <span className="text-gray-700">
                {selectedItem.addons.join(', ')}
              </span>
            </p>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-gradient-to-r from-orange-500 to-amber-300 text-white rounded-lg px-6 py-2 text-base font-semibold cursor-pointer transition duration-200 hover:bg-[#c95d0c] hover:scale-105 md:text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
