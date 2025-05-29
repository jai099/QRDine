import React from 'react';
import WaiterOrderCard from './WaiterOrderCard';
import './WaiterOrdersList.css';

export default function WaiterOrdersList({ orders, assigned, onAssign, onServe, isHistory, waiterName }) {
  if (!orders.length) {
    return <div className="waiter-empty">{isHistory ? 'No delivered orders yet.' : 'No ready orders found.'}</div>;
  }
  return (
    <div className="waiter-orders-list">
      {orders.map(order => (
        <WaiterOrderCard
          key={order.id}
          order={order}
          assigned={assigned && assigned.includes && assigned.includes(order.id)}
          onAssign={onAssign}
          onServe={onServe}
          isHistory={isHistory}
          waiterName={waiterName}
        />
      ))}
    </div>
  );
}
