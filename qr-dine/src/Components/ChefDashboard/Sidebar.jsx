import React from 'react';
import './ChefDashboard.css';

const Sidebar = ({ active, onNavigate, chefName }) => (
  <nav className="chef-sidebar">
    <div className="chef-sidebar-header">👨‍🍳<br />{chefName || 'Chef'}</div>
    <ul className="chef-sidebar-list">
      <li className={active === 'orders' ? 'active' : ''} onClick={() => onNavigate('orders')}>Orders</li>
      <li className={active === 'history' ? 'active' : ''} onClick={() => onNavigate('history')}>History</li>
      <li className={active === 'profile' ? 'active' : ''} onClick={() => onNavigate('profile')}>Profile</li>
      <li className={active === 'logout' ? 'active' : ''} onClick={() => onNavigate('logout')}>Logout</li>
    </ul>
  </nav>
);

export default Sidebar;
