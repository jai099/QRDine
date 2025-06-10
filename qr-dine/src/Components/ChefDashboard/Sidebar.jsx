import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ added import
import { FaUtensils, FaUserCircle, FaSignOutAlt, FaClock } from 'react-icons/fa';

const Sidebar = ({ active, onNavigate, chefName }) => {
  const navigate = useNavigate(); // ✅ added navigate hook

  const navItems = [
    { key: 'orders', label: 'Orders', icon: <FaUtensils /> },
    { key: 'history', label: 'History', icon: <FaClock /> },
    { key: 'profile', label: 'Profile', icon: <FaUserCircle /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('chefName');
    localStorage.removeItem('chefOrders');
    navigate('/'); // ✅ redirect to login page
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-orange-100 shadow-sm p-6 sticky top-0 h-auto md:h-screen flex md:flex-col md:justify-between">
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-orange-600">👨‍🍳 {chefName}</h2>
          <p className="text-sm text-orange-500">Chef Dashboard</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition duration-200 ${
                active === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'text-orange-700 hover:bg-orange-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
      >
        🚪 Logout
      </button>
    </aside>
  );
};

export default Sidebar;
