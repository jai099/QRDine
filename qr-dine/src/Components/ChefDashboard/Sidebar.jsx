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
    <aside className="w-full md:w-64 bg-white shadow-md border-r border-orange-100 p-6 flex flex-col gap-4">
      <div className="text-2xl font-bold text-orange-600 text-center mb-8">
        👨‍🍳 {chefName}
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-left transition duration-200 mb-2
              ${
                active === item.key
                  ? 'bg-orange-100 text-orange-700 font-semibold'
                  : 'text-orange-600 hover:bg-orange-50'
              }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center transition duration-200"
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
