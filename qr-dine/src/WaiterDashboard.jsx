import React, { useEffect, useState } from 'react';
import './WaiterDashboard.css';
import './waiter/WaiterOrderCard.css';
import './waiter/WaiterOrdersList.css';
import './waiter/WaiterSidebar.css';
import './waiter/WaiterProfile.css';
import WaiterSidebar from './waiter/WaiterSidebar';
import WaiterOrdersList from './waiter/WaiterOrdersList';
import WaiterProfile from './waiter/WaiterProfile';

function getInitialHistory() {
  // In real app, fetch from backend
  return JSON.parse(localStorage.getItem('waiterHistory') || '[]');
}

function saveHistory(history) {
  localStorage.setItem('waiterHistory', JSON.stringify(history));
}

const WAITER_PROFILE = {
  name: 'Amit Kumar',
  id: 'W123',
  phone: '+91-9876543210',
  joined: '2023-08-15',
  avatar: '🧑‍🍳',
};

async function fetchReadyOrders() {
  // Replace with: await fetch('/api/orders?status=ready').then(r => r.json())
  return [
    {
      id: 201,
      table: 5,
      items: [
        { name: 'Paneer Butter Masala', qty: 2 },
        { name: 'Butter Naan', qty: 4 }
      ],
      notes: 'No onion',
      chef: 'Chef Arjun',
      readyAt: Date.now() - 1000 * 60 * 3, // 3 min ago
      status: 'ready',
      assignedTo: null
    },
    {
      id: 202,
      table: 2,
      items: [
        { name: 'Chicken Biryani', qty: 1 }
      ],
      notes: '',
      chef: 'Chef Priya',
      readyAt: Date.now() - 1000 * 60 * 7, // 7 min ago
      status: 'ready',
      assignedTo: null
    }
  ];
}

export default function WaiterDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [assigned, setAssigned] = useState([]); // order IDs
  const [toast, setToast] = useState(null);
  const [view, setView] = useState('orders'); // 'orders' | 'history' | 'profile'
  const [history, setHistory] = useState(getInitialHistory());

  useEffect(() => {
    fetchReadyOrders().then(setOrders);
  }, []);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  function handleAssign(orderId) {
    setAssigned(ids => [...ids, orderId]);
    setToast(`Order #${orderId} assigned to you!`);
    setTimeout(() => setToast(null), 1800);
  }

  function handleServe(orderId) {
    const order = orders.find(o => o.id === orderId);
    setOrders(orders => orders.filter(o => o.id !== orderId));
    setHistory(hist => [
      {
        ...order,
        servedAt: Date.now(),
        waiter: WAITER_PROFILE.name,
      },
      ...hist
    ]);
    setToast(`Order #${orderId} marked as served!`);
    setTimeout(() => setToast(null), 1800);
  }

  const filtered = orders.filter(o =>
    o.id.toString().includes(search) || o.table.toString().includes(search)
  );

  return (
    <div className="waiter-dashboard-root">
      <WaiterSidebar view={view} setView={setView} />
      <main className="waiter-main">
        {view === 'orders' && (
          <>
            <div className="waiter-main-header">
              <h2>Ready Orders</h2>
              <input
                className="waiter-search"
                placeholder="Search by table or order ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <WaiterOrdersList
              orders={filtered}
              assigned={assigned}
              onAssign={handleAssign}
              onServe={handleServe}
              isHistory={false}
            />
          </>
        )}
        {view === 'history' && (
          <WaiterOrdersList
            orders={history}
            assigned={[]}
            onAssign={()=>{}}
            onServe={()=>{}}
            isHistory={true}
            waiterName={WAITER_PROFILE.name}
          />
        )}
        {view === 'profile' && (
          <WaiterProfile profile={WAITER_PROFILE} ordersServed={history.length} />
        )}
        {toast && <div className="waiter-toast">{toast}</div>}
      </main>
    </div>
  );
}
