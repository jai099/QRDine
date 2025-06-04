import React from 'react';
import WaiterOrderCard from './WaiterOrderCard';

export default function WaiterOrdersList({ orders, assigned, onAssign, onServe, isHistory, waiterName }) {
  if (!orders.length) {
    return (
      <div className="text-orange-500 font-bold text-lg text-center mt-10 col-span-full">
        {isHistory ? 'No delivered orders yet.' : 'No ready orders found.'}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
      {orders.map(order => (
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
  );
}