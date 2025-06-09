import React from 'react';
import WaiterOrderCard from './WaiterOrderCard';

export default function WaiterOrdersList({ orders, assigned, onAssign, onServe, isHistory, waiterName }) {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div className="w-full">
      {!hasOrders ? (
        <div className="text-orange-500 font-semibold text-center mt-12 text-base sm:text-lg tracking-wide">
          {isHistory ? 'No delivered orders yet.' : 'No ready orders found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {orders.filter(Boolean).map((order) => (
            <WaiterOrderCard
              key={order.id}
              order={order}
              assigned={Array.isArray(assigned) && assigned.includes(order.id)}
              onAssign={onAssign}
              onServe={onServe}
              isHistory={isHistory}
              waiterName={waiterName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
