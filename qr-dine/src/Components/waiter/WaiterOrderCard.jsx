import React from 'react';
import './WaiterOrderCard.css';

export default function WaiterOrderCard({ order, assigned, onAssign, onServe, isHistory, waiterName }) {
  function timeSince(ts) {
    const min = Math.floor((Date.now() - ts) / 60000);
    return min === 0 ? 'Just now' : `${min} min ago`;
  }
  return (
    <div className={`waiter-order-card${assigned ? ' assigned' : ''}${isHistory ? ' history' : ''}`}>
      <div className="waiter-order-row">
        <span className="waiter-order-id">#{order.id}</span>
        <span className="waiter-order-table">Table {order.table}</span>
        <span className="waiter-order-time">
          {isHistory ? new Date(order.servedAt).toLocaleString() : timeSince(order.readyAt)}
        </span>
      </div>
      <div className="waiter-order-items">
        {order.items.map((item, idx) => (
          <span key={idx} className="waiter-order-item">{item.name} × {item.qty}</span>
        ))}
      </div>
      {order.notes && <div className="waiter-order-notes">📝 {order.notes}</div>}
      <div className="waiter-order-meta">
        <span>👨‍🍳 {order.chef}</span>
        <span className="waiter-order-status" style={isHistory ? {background:'#888'} : {}}>
          {isHistory ? 'Served' : 'Ready to Serve'}
        </span>
      </div>
      {isHistory && (
        <div className="waiter-order-meta" style={{fontSize:'0.95rem',color:'#888'}}>
          By: {order.waiter || waiterName}
        </div>
      )}
      {!isHistory && (
        <div className="waiter-order-actions">
          {!assigned ? (
            <button className="waiter-assign-btn" onClick={() => onAssign(order.id)}>
              Assign to Me
            </button>
          ) : (
            <button className="waiter-serve-btn" onClick={() => onServe(order.id)}>
              Mark as Served
            </button>
          )}
        </div>
      )}
    </div>
  );
}
