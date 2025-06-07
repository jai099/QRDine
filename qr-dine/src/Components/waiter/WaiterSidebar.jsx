import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Clock, User, Bell, LogOut } from 'lucide-react';

export default function WaiterSidebar({ view, setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsCount] = useState(3); // Example: dynamic notification count

  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3 } },
    closed: { x: '-100%', transition: { duration: 0.3 } }
  };

  const navItems = [
    { id: 'orders', label: 'Orders', icon: <Home size={20} /> },
    { id: 'history', label: 'History', icon: <Clock size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, badge: notificationsCount },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-[240px] bg-gradient-to-b from-orange-100 to-amber-50 border-r border-orange-200 pt-8 px-4 shadow-lg">
        <div className="text-2xl font-bold text-orange-600 mb-10 text-center">Waiter Dashboard</div>
        <nav className="flex flex-col gap-3">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05, backgroundColor: '#fed7aa' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-5 py-3 text-lg font-semibold rounded-lg transition-all 
                ${view === item.id ? 'bg-orange-200 text-orange-700' : 'text-orange-600'}`}
            >
              {item.icon}
              {item.label}
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#fed7aa' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Logout')}
            className="flex items-center gap-3 px-5 py-3 text-lg font-semibold text-orange-600 rounded-lg transition-all"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </nav>
      </aside>

      {/* Sidebar for Mobile */}
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-50 text-orange-600 text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-[220px] bg-gradient-to-b from-orange-100 to-amber-50 z-40 shadow-lg p-5"
            >
              <div className="text-xl font-bold text-orange-600 mb-6">Waiter Dashboard</div>
              <nav className="flex flex-col gap-3">
                {navItems.map(item => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05, backgroundColor: '#fed7aa' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setView(item.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2 text-base font-medium rounded-lg 
                      ${view === item.id ? 'bg-orange-200 text-orange-700' : 'text-orange-600'}`}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#fed7aa' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    alert('Logout');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-base font-medium text-orange-600 rounded-lg"
                >
                  <LogOut size={20} />
                  Logout
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}