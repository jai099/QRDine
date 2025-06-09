import React from 'react';

export default function WaiterOrderCard({ order, assigned, onAssign, onServe, isHistory, waiterName }) {
  function timeSince(ts) {
    const min = Math.floor((Date.now() - ts) / 60000);
    return min === 0 ? 'Just now' : `${min} min ago`;
  }

  const priorityBadge = {
    Low: 'bg-green-100 text-green-600',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-red-100 text-red-600',
  };

  return (
    <div
      className={`bg-warm-100 rounded-2xl p-4 shadow-[0_2px_10px_rgba(255,152,0,0.07)] border-2 transition-all duration-300 
        ${assigned ? 'border-[2.5px] border-green-500 shadow-[0_0_16px_#43ea5ecc]' : ''}
        ${isHistory ? 'border-gray-400 bg-gray-100 shadow-[0_2px_8px_rgba(120,120,120,0.07)]' : 'border-warm-200'}
      `}
    >
      {/* Header: Order ID, Table No, Time */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 text-orange-600">
        <div className="flex items-center gap-3 font-bold text-lg">
          <span className="bg-warm-200 px-2.5 py-0.5 rounded-lg text-orange-500 text-base">#{order.id}</span>
          <span className="font-extrabold text-lg">Table {order.table}</span>
        </div>
        <span className="text-sm text-orange-500 sm:text-base">
          {isHistory ? new Date(order.servedAt).toLocaleString() : timeSince(order.readyAt)}
        </span>
      </div>

      {/* Order Items */}
      <div className="flex flex-wrap gap-2 mb-2">
        {order.items.map((item, idx) => (
          <span
            key={idx}
            className="bg-warm-300 rounded-lg px-3 py-1 text-orange-600 font-semibold text-sm sm:text-base shadow-sm"
          >
            {item.name} × {item.qty}
          </span>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="text-orange-500 text-sm sm:text-base mb-2 flex items-start gap-2">
          📝 <span>{order.notes}</span>
        </div>
      )}

      {/* Chef + Status + Priority */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-orange-600 mb-2">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          👨‍🍳 <span>{order.chef}</span>
          <span
            className={`ml-3 px-3 py-0.5 rounded-lg font-bold text-white text-sm sm:text-base ${
              isHistory ? 'bg-gray-500' : 'bg-green-500'
            }`}
          >
            {isHistory ? 'Served' : 'Ready to Serve'}
          </span>
        </div>
        {order.priority && (
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-semibold shadow-sm ${
              priorityBadge[order.priority] || 'bg-gray-200 text-gray-700'
            }`}
          >
            Priority: {order.priority}
          </span>
        )}
      </div>

      {/* Waiter name if history */}
      {isHistory && (
        <div className="text-sm text-gray-500 italic">By: {order.waiter || waiterName}</div>
      )}

      {/* Action Buttons */}
      {!isHistory && (
        <div className="flex mt-3 gap-3 flex-wrap">
          {!assigned ? (
            <button
              className="bg-gradient-to-r from-orange-500 to-amber-300 text-white rounded-[10px] font-bold text-sm sm:text-base py-2 px-5 shadow transition-all hover:brightness-110 hover:shadow-[0_0_10px_#ff9800aa]"
              onClick={() => onAssign(order.id)}
            >
              Assign to Me
            </button>
          ) : (
            <button
              className="bg-gradient-to-r from-green-500 to-green-300 text-white rounded-[10px] font-bold text-sm sm:text-base py-2 px-5 shadow transition-all hover:brightness-110 hover:shadow-[0_0_10px_#43ea5ecc]"
              onClick={() => onServe(order.id)}
            >
              Mark as Served
            </button>
          )}
        </div>
      )}
    </div>
  );
}
