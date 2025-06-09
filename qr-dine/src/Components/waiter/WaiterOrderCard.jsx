import React from 'react';

export default function WaiterOrderCard({
  order,
  assigned,
  onAssign,
  onServe,
  isHistory,
  waiterName,
  isServing = false, // Add loading state for serve action
}) {
  // If this is a history card, show delivered status and details
  if (isHistory) {
    return (
      <div className="rounded-2xl p-5 shadow-lg border bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-orange-700 font-bold bg-orange-100 px-2 py-1 rounded">#{order.id}</span>
          <span className="text-lg font-bold text-orange-800">Table {order.table}</span>
          <span className="text-xs text-gray-500">{new Date(order.servedAt).toLocaleTimeString()}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {order.items.map((item, idx) => (
            <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
              {item.name} × {item.qty}
            </span>
          ))}
        </div>
        <div className="mb-2 text-sm text-gray-600">Served by: {order.waiter || waiterName}</div>
        <div className="text-sm text-green-600 font-bold">Delivered in {order.deliveryTime} min</div>
      </div>
    );
  }

  // Check if order is in process of being served (to prevent reappearing)
  const isBeingServed = isServing || order.status === 'serving';

  // For active orders
  return (
    <div
      className={`rounded-2xl p-5 shadow-lg border transition-all duration-300 ${
        assigned 
          ? 'ring-2 ring-green-400 bg-green-50' 
          : isBeingServed 
          ? 'bg-gray-100 opacity-75' 
          : 'bg-yellow-50'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-orange-700 font-bold bg-orange-100 px-2 py-1 rounded">#{order.id}</span>
        <span className="text-lg font-bold text-orange-800">Table {order.table}</span>
        <span className="text-xs text-gray-500">
          {Math.floor((Date.now() - order.readyAt) / 60000)} min ago
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {order.items.map((item, idx) => (
          <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
            {item.name} × {item.qty}
          </span>
        ))}
      </div>
      
      {order.notes && (
        <div className="mb-2">
          <span className="text-gray-600 text-sm">📝 {order.notes}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">👨‍🍳 {order.chef}</span>
        <span className={`px-2 py-1 rounded text-xs ${
          isBeingServed 
            ? 'bg-blue-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {isBeingServed ? 'Being Served' : 'Ready to Serve'}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${
          order.priority === 'high' 
            ? 'bg-red-200 text-red-700' 
            : order.priority === 'medium' 
            ? 'bg-yellow-200 text-yellow-700' 
            : 'bg-blue-200 text-blue-700'
        }`}>
          Priority: {order.priority}
        </span>
      </div>
      
      <div className="mt-2">
        {!assigned && !isBeingServed ? (
          <button
            onClick={() => onAssign(order.id)}
            className="bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-lg font-bold text-sm py-2 px-4 shadow-lg hover:scale-105 transition-all"
          >
            Assign to Me
          </button>
        ) : assigned && !isBeingServed ? (
          <div className="flex gap-2 items-center">
            <span className="bg-green-500 text-white rounded-lg font-bold text-sm py-2 px-4 shadow">
              Assigned to You
            </span>
            <button
              onClick={() => onServe(order.id)}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-bold text-sm py-2 px-4 shadow-lg hover:scale-105 transition-all"
            >
              Mark as Served
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="bg-blue-500 text-white rounded-lg font-bold text-sm py-2 px-4 shadow">
              ✓ Served
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
