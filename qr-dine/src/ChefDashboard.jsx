import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './ChefDashboard.css';

const CHEF_NAME = localStorage.getItem('chefName') || 'Chef';

const getOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem('chefOrders'));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
};

const STATUS_FLOW = ['Placed', 'Preparing', 'Ready', 'Completed'];

const ChefDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState(getOrders());
  const [modalOrder, setModalOrder] = useState(null);
  const [chefName] = useState(CHEF_NAME);

  // Poll for new orders every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(getOrders());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Accept order (assign chef)
  const acceptOrder = (orderId) => {
    const updated = orders.map(order =>
      order.id === orderId && !order.chef
        ? { ...order, chef: chefName, status: 'Preparing', acceptedAt: Date.now() }
        : order
    );
    setOrders(updated);
    localStorage.setItem('chefOrders', JSON.stringify(updated));
  };

  // Update order status
  const updateStatus = (orderId) => {
    const updated = orders.map(order => {
      if (order.id === orderId && order.chef === chefName) {
        const idx = STATUS_FLOW.indexOf(order.status);
        if (idx !== -1 && idx < STATUS_FLOW.length - 1) {
          return { ...order, status: STATUS_FLOW[idx + 1] };
        }
      }
      return order;
    });
    setOrders(updated);
    localStorage.setItem('chefOrders', JSON.stringify(updated));
  };

  // Live timer for each order
  const getElapsed = (placed) => {
    if (!placed) return '0s';
    const sec = Math.floor((Date.now() - placed) / 1000);
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.floor(sec/60)}m ${sec%60}s`;
    return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
  };

  // Auth check (simple demo)
  if (!chefName) {
    return <div className="chef-dashboard-bg">Please log in as a chef.</div>;
  }

  return (
    <div className="chef-dashboard-layout">
      <Sidebar active={activeTab} onNavigate={setActiveTab} chefName={chefName} />
      <main className="chef-dashboard-main">
        {activeTab === 'orders' && (
          <>
            <h1 className="chef-dashboard-title">Live Orders</h1>
            <div className="chef-orders-list">
              {orders.filter(o => o.status !== 'Completed').length === 0 && (
                <div className="chef-dashboard-empty">No live orders.</div>
              )}
              {orders.filter(o => o.status !== 'Completed').map(order => (
                <div className="chef-order-card" key={order.id}>
                  <div className="chef-order-header">
                    <span>Order #{order.id}</span>
                    <span>Table: {order.table || 12}</span>
                  </div>
                  <ul className="chef-order-items">
                    {order.items.map((item, i) => (
                      <li key={i} className="chef-order-item">
                        <span className="chef-order-item-name">{item.name}</span>
                        <span className="chef-order-item-qty">x{item.qty || item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="chef-order-notes">{order.notes && <>📝 {order.notes}</>}</div>
                  <div className="chef-order-meta">
                    <span>Status: <b>{order.status || 'Placed'}</b></span>
                    <span>Chef: {order.chef || <i>Unassigned</i>}</span>
                    <span>⏱ {getElapsed(order.acceptedAt || order.id)}</span>
                  </div>
                  <div style={{marginTop: 8, display: 'flex', gap: 8}}>
                    {!order.chef && (
                      <button className="chef-order-btn" onClick={() => acceptOrder(order.id)}>Accept</button>
                    )}
                    {order.chef === chefName && order.status !== 'Completed' && (
                      <button className="chef-order-btn" onClick={() => updateStatus(order.id)}>
                        Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(order.status || 'Placed') + 1] || 'Completed'}
                      </button>
                    )}
                    <button className="chef-order-btn secondary" onClick={() => setModalOrder(order)}>Details</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* History, Profile, etc. can be implemented similarly */}
        {modalOrder && (
          <div className="chef-modal-bg" onClick={() => setModalOrder(null)}>
            <div className="chef-modal-content" onClick={e => e.stopPropagation()}>
              <h2>Order #{modalOrder.id}</h2>
              <div>Table: {modalOrder.table}</div>
              <ul>
                {modalOrder.items.map((item, i) => (
                  <li key={i}>{item.name} x{item.qty || item.quantity}</li>
                ))}
              </ul>
              {modalOrder.notes && <div>📝 {modalOrder.notes}</div>}
              <div>Status: {modalOrder.status || 'Placed'}</div>
              <div>Chef: {modalOrder.chef || <i>Unassigned</i>}</div>
              <div>Placed: {new Date(Number(modalOrder.id)).toLocaleString()}</div>
              <button className="chef-order-btn" onClick={() => setModalOrder(null)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChefDashboard;
