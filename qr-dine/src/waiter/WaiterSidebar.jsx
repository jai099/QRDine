import React from 'react';
import './WaiterSidebar.css';

export default function WaiterSidebar({ view, setView }) {
  return (
    <aside className="waiter-sidebar">
      <div className="waiter-sidebar-logo">🍽️ QRDine</div>
      <nav>
        <button className={`waiter-sidebar-link${view==='orders'?' active':''}`} onClick={()=>setView('orders')}>🏠 Orders</button>
        <button className={`waiter-sidebar-link${view==='history'?' active':''}`} onClick={()=>setView('history')}>🧾 History</button>
        <button className={`waiter-sidebar-link${view==='profile'?' active':''}`} onClick={()=>setView('profile')}>🙍‍♂️ Profile</button>
        <button className="waiter-sidebar-link">🚪 Logout</button>
      </nav>
    </aside>
  );
}
