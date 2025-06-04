import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';

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
    return <div className="min-h-screen bg-gradient-to-r from-warm-300 to-warm-200 flex items-center justify-center font-sans">Please log in as a chef.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-warm-300 to-warm-200 md:flex-col">
      <Sidebar active={activeTab} onNavigate={setActiveTab} chefName={chefName} />
      <main className="flex-1 p-12 min-w-0 flex flex-col items-stretch md:p-[6vw] md:pt-4.5 md:pb-4.5">
        {activeTab === 'orders' && (
          <>
            <h1 className="text-4xl font-extrabold text-orange-500 mb-2.5 text-center tracking-widest">Live Orders</h1>
            <div className="flex flex-col gap-4.5">
              {orders.filter(o => o.status !== 'Completed').length === 0 && (
                <div className="text-orange-500 font-bold text-lg text-center mt-10">No live orders.</div>
              )}
              {orders.filter(o => o.status !== 'Completed').map(order => (
                <div className="bg-warm-300 rounded-2xl shadow-[0_2px_8px_#ffe0b2] p-4.5 animate-foodCardPop" key={order.id}>
                  <div className="flex justify-between font-bold text-orange-600 mb-2.5">
                    <span>Order #{order.id}</span>
                    <span>Table: {order.table || 12}</span>
                  </div>
                  <ul className="list-none p-0 m-0 mb-2">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-orange-500 font-semibold text-base mb-1">
                        <span className="flex-1">{item.name}</span>
                        <span className="ml-3">x{item.qty || item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-orange-600 text-base mb-1.5">{order.notes && <>📝 {order.notes}</>}</div>
                  <div className="flex gap-4.5 text-orange-600 text-base mt-2 flex-wrap sm:flex-col sm:gap-1.5">
                    <span>Status: <b>{order.status || 'Placed'}</b></span>
                    <span>Chef: {order.chef || <i>Unassigned</i>}</span>
                    <span>⏱ {getElapsed(order.acceptedAt || order.id)}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {!order.chef && (
                      <button
                        className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-[10px] font-bold text-base px-4.5 py-2 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.10)] hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc] transition-all duration-200"
                        onClick={() => acceptOrder(order.id)}
                      >
                        Accept
                      </button>
                    )}
                    {order.chef === chefName && order.status !== 'Completed' && (
                      <button
                        className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-[10px] font-bold text-base px-4.5 py-2 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.10)] hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc] transition-all duration-200"
                        onClick={() => updateStatus(order.id)}
                      >
                        Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(order.status || 'Placed') + 1] || 'Completed'}
                      </button>
                    )}
                    <button
                      className="bg-warm-200 text-orange-600 border-none rounded-[10px] font-bold text-base px-4.5 py-2 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.10)] hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc] transition-all duration-200"
                      onClick={() => setModalOrder(order)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {modalOrder && (
          <div
            className="fixed inset-0 bg-black/25 z-[1000] flex items-center justify-center"
            onClick={() => setModalOrder(null)}
          >
            <div
              className="bg-warm-100 rounded-[18px] p-9 min-w-[280px] max-w-[90vw] shadow-[0_4px_32px_#ff9800cc] text-center animate-popIn sm:p-2.5 sm:min-w-[120px]"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Order #{modalOrder.id}</h2>
              <div className="text-base text-orange-600 mb-2">Table: {modalOrder.table}</div>
              <ul className="list-none p-0 m-0 mb-2">
                {modalOrder.items.map((item, i) => (
                  <li key={i} className="text-base text-orange-600 mb-1">{item.name} x{item.qty || item.quantity}</li>
                ))}
              </ul>
              {modalOrder.notes && <div className="text-base text-orange-600 mb-2">📝 {modalOrder.notes}</div>}
              <div className="text-base text-orange-600 mb-2">Status: {modalOrder.status || 'Placed'}</div>
              <div className="text-base text-orange-600 mb-2">Chef: {modalOrder.chef || <i>Unassigned</i>}</div>
              <div className="text-base text-orange-600 mb-4">Placed: {new Date(Number(modalOrder.id)).toLocaleString()}</div>
              <button
                className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-[10px] font-bold text-base px-4.5 py-2 cursor-pointer shadow-[0_2px_8px_rgba(255,152,0,0.10)] hover:brightness-110 hover:drop-shadow-[0_0_8px_#ff9800cc] transition-all duration-200"
                onClick={() => setModalOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChefDashboard;