import React from 'react';

export default function WaiterOrderCard({ order, assigned, onAssign, onServe, isHistory, waiterName }) {
  function timeSince(ts) {
    const min = Math.floor((Date.now() - ts) / 60000);
    return min === 0 ? 'Just now' : `${min} min ago`;
  }
  return (
    <div
      className={`bg-warm-100 rounded-2xl shadow-[0_2px_10px_rgba(255,152,0,0.07)] p-5 flex flex-col gap-2 border-2 border-warm-200 transition-all duration-200 relative ${assigned ? 'border-[2.5px] border-green-500 shadow-[0_0_16px_#43ea5ecc]' : ''} ${isHistory ? 'border-2 border-gray-400 bg-gray-100 shadow-[0_2px_8px_rgba(120,120,120,0.07)]' : ''}`}
    >
      <div className="flex items-center gap-4.5 text-lg font-bold text-orange-600">
        <span className="bg-warm-200 rounded-lg px-2.5 py-0.5 text-orange-500">#{order.id}</span>
        <span className="font-extrabold">Table {order.table}</span>
        <span className="ml-auto text-orange-500 text-base">
          {isHistory ? new Date(order.servedAt).toLocaleString() : timeSince(order.readyAt)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5 mb-0.5">
        {order.items.map((item, idx) => (
          <span key={idx} className="bg-warm-300 rounded-lg px-3 py-1 text-orange-600 font-semibold text-base">
            {item.name} × {item.qty}
          </span>
        ))}
      </div>
      {order.notes && <div className="text-orange-500 text-base mb-0.5">📝 {order.notes}</div>}
      <div className="flex items-center gap-4.5 text-base text-orange-600">
        <span>👨‍🍳 {order.chef}</span>
        <span
          className={`rounded-lg px-3 py-0.5 font-bold text-base ml-2 ${isHistory ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'}`}
        >
          {isHistory ? 'Served' : 'Ready to Serve'}
        </span>
      </div>
      {isHistory && (
        <div className="flex items-center gap-4.5 text-sm text-gray-500">
          By: {order.waiter || waiterName}
        </div>
      )}
      {!isHistory && (
        <div className="flex gap-3 mt-2">
          {!assigned ? (
            <button
              className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-[10px] font-bold text-base py-2 px-5.5 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.10)] transition-all duration-200 hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc]"
              onClick={() => onAssign(order.id)}
            >
              Assign to Me
            </button>
          ) : (
            <button
              className="bg-gradient-to-r from-green-500 to-green-300 text-white border-none rounded-[10px] font-bold text-base py-2 px-5.5 cursor-pointer shadow-[0_2px_8px_rgba(67,234,94,0.10)] transition-all duration-200 hover:brightness-110 hover:drop-shadow-[0_0_8px_#43ea5ecc]"
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