import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import toast, { Toaster } from 'react-hot-toast';
import { Search, RefreshCw, Clock, TrendingUp, Award, Zap, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import WaiterSidebar from './WaiterSidebar.jsx';
import WaiterOrdersList from './WaiterOrdersList';
import WaiterProfile from './WaiterProfile.jsx';

// PWA Manifest and Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.error('Service Worker registration failed:', err));
  });
}

function getInitialHistory() {
  return JSON.parse(localStorage.getItem('waiterHistory') || '[]');
}

function saveHistory(history) {
  localStorage.setItem('waiterHistory', JSON.stringify(history));
}

function getInitialTheme() {
  return localStorage.getItem('waiterTheme') || 'warm';
}

const WAITER_PROFILE = {
  name: 'Amit Kumar',
  id: 'W123',
  phone: '+91-9876543210',
  joined: '2023-08-15',
  avatar: '🧑‍🍳',
};

// Simulated Supabase Realtime Data
const mockSupabaseClient = {
  orders: [
    {
      id: 201,
      table: 5,
      items: [
        { name: 'Paneer Butter Masala', qty: 2 },
        { name: 'Butter Naan', qty: 4 },
      ],
      notes: 'No onion',
      chef: 'Chef Arjun',
      readyAt: Date.now() - 1000 * 60 * 3,
      status: 'ready',
      assignedTo: null,
      priority: 'high',
      estimatedDeliveryTime: 5,
    },
    {
      id: 202,
      table: 2,
      items: [{ name: 'Chicken Biryani', qty: 1 }],
      notes: '',
      chef: 'Chef Priya',
      readyAt: Date.now() - 1000 * 60 * 7,
      status: 'ready',
      assignedTo: null,
      priority: 'medium',
      estimatedDeliveryTime: 3,
    },
    {
      id: 203,
      table: 8,
      items: [
        { name: 'Masala Dosa', qty: 2 },
        { name: 'Filter Coffee', qty: 2 },
      ],
      notes: 'Extra sambar',
      chef: 'Chef Ravi',
      readyAt: Date.now() - 1000 * 60 * 1,
      status: 'ready',
      assignedTo: null,
      priority: 'low',
      estimatedDeliveryTime: 2,
    },
  ],
  tables: [
    { table: 5, status: 'Awaiting Delivery', lastUpdated: Date.now() - 1000 * 60 * 3 },
    { table: 2, status: 'Idle', lastUpdated: Date.now() - 1000 * 60 * 7 },
    { table: 8, status: 'Help Requested', lastUpdated: Date.now() - 1000 * 60 * 1 },
  ],
  notifications: [
    { id: 1, message: 'Order #201 is ready to deliver to Table 5', type: 'order', timestamp: Date.now() - 1000 * 60 * 3, priority: 'high' },
    { id: 2, message: 'Table 8 requested help', type: 'help', timestamp: Date.now() - 1000 * 60 * 1, priority: 'urgent' },
  ],
};

async function fetchReadyOrders() {
  await new Promise(resolve => setTimeout(resolve, 800));
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  // Only return orders that are still ready
  return mockSupabaseClient.orders
    .filter(order => order.status === 'ready')
    .sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.readyAt - a.readyAt;
    });
}


async function fetchTables() {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockSupabaseClient.tables;
}

async function fetchNotifications() {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockSupabaseClient.notifications;
}

export default function WaiterDashboard() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState('');
  const [assigned, setAssigned] = useState([]);
  const [view, setView] = useState('orders');
  const [history, setHistory] = useState(getInitialHistory());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    assignedOrders: 0,
    completedToday: 0,
    avgDeliveryTime: 0,
  });
  const [theme, setTheme] = useState(getInitialTheme());
  const [sortBy, setSortBy] = useState('priority');
  const [filterBy, setFilterBy] = useState('all');
  const [showInsights, setShowInsights] = useState(false);
  const refreshIntervalRef = useRef(null);
  const audioRef = useRef(null);

  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  });

  const statsSpring = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    delay: 200,
    config: { tension: 300, friction: 25 },
  });

  const fetchOrders = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const newOrders = await fetchReadyOrders();
      setOrders(newOrders);
      setStats(prev => ({
        ...prev,
        totalOrders: newOrders.length,
        assignedOrders: assigned.length,
      }));
      if (orders.length > 0 && newOrders.length > orders.length) {
        const newOrdersCount = newOrders.length - orders.length;
        toast.success(`🔔 ${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} ready!`, {
          duration: 4000,
          icon: '🍽',
        });
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        if ('vibrate' in navigator) navigator.vibrate(200);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, [orders.length, assigned.length]);

  const fetchTablesData = useCallback(async () => {
    try {
      const tableData = await fetchTables();
      setTables(tableData);
    } catch (error) {
      toast.error('Failed to fetch table data');
    }
  }, []);

  const fetchNotificationsData = useCallback(async () => {
    try {
      const notificationData = await fetchNotifications();
      setNotifications(notificationData);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchTablesData();
    fetchNotificationsData();
    refreshIntervalRef.current = setInterval(() => {
      fetchOrders(false);
      fetchTablesData();
      fetchNotificationsData();
    }, 30000);
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchOrders, fetchTablesData, fetchNotificationsData]);

  useEffect(() => {
    saveHistory(history);
    const todayHistory = history.filter(order => {
      const today = new Date().toDateString();
      return new Date(order.servedAt).toDateString() === today;
    });
    setStats(prev => ({
      ...prev,
      completedToday: todayHistory.length,
      avgDeliveryTime: todayHistory.length
        ? Math.round(todayHistory.reduce((sum, order) => sum + order.deliveryTime, 0) / todayHistory.length)
        : 0,
    }));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('waiterTheme', theme);
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  function handleAssign(orderId) {
    setAssigned(ids => [...ids, orderId]);
    toast.success(`🎯 Order #${orderId} assigned to you!`, {
      duration: 3000,
      icon: '✅',
    });
    setStats(prev => ({
      ...prev,
      assignedOrders: prev.assignedOrders + 1,
    }));
  }

 function handleServe(orderId) {
  // Find the order object before using it
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    toast.error(`Order #${orderId} not found!`);
    return;
  }

  // Update the mock backend so the order is not returned as "ready" again
  const backendOrder = mockSupabaseClient.orders.find(o => o.id === orderId);
  if (backendOrder) {
    backendOrder.status = 'served';
  }

  setOrders(orders => orders.filter(o => o.id !== orderId));
  setAssigned(ids => ids.filter(id => id !== orderId));
  const servedOrder = {
    ...order,
    servedAt: Date.now(),
    waiter: WAITER_PROFILE.name,
    deliveryTime: Math.floor((Date.now() - order.readyAt) / 60000),
  };
  setHistory(hist => [servedOrder, ...hist]);
  setTables(tables => tables.map(t =>
    t.table === order.table ? { ...t, status: 'Needs Cleaning', lastUpdated: Date.now() } : t
  ));
  toast.success(`🎉 Order #${orderId} served successfully!`, {
    duration: 4000,
    icon: '🍽',
  });
  setStats(prev => ({
    ...prev,
    assignedOrders: Math.max(0, prev.assignedOrders - 1),
    completedToday: prev.completedToday + 1,
    avgDeliveryTime: Math.round(
      (prev.avgDeliveryTime * prev.completedToday + servedOrder.deliveryTime) / (prev.completedToday + 1)
    ),
  }));
}

  function handleDeliver(tableNumber) {
    setTables(tables => tables.map(t =>
      t.table === tableNumber ? { ...t, status: 'Needs Cleaning', lastUpdated: Date.now() } : t
    ));
    toast.success(`📦 Table ${tableNumber} marked as delivered!`, { duration: 3000 });
  }

  function handleClear(tableNumber) {
    setTables(tables => tables.map(t =>
      t.table === tableNumber ? { ...t, status: 'Idle', lastUpdated: Date.now() } : t
    ));
    toast.success(`🧹 Table ${tableNumber} cleared!`, { duration: 3000 });
  }

  function handleAssist(tableNumber) {
    setTables(tables => tables.map(t =>
      t.table === tableNumber ? { ...t, status: 'Idle', lastUpdated: Date.now() } : t
    ));
    setNotifications(notifs => notifs.filter(n => n.message !== `Table ${tableNumber} requested help`));
    toast.success(`🆘 Assistance provided for Table ${tableNumber}!`, { duration: 3000 });
  }

  // Smart Sorting and Filtering
  const sortOrders = (orders) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...orders].sort((a, b) => {
      if (sortBy === 'priority') {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'chef') {
        return a.chef.localeCompare(b.chef);
      } else if (sortBy === 'table') {
        return a.table - b.table;
      }
      return 0;
    });
  };

  const filterOrders = (orders) => {
    if (filterBy === 'all') return orders;
    if (filterBy === 'highPriority') return orders.filter(o => o.priority === 'high');
    if (filterBy === 'assigned') return orders.filter(o => assigned.includes(o.id));
    return orders;
  };

  const filtered = filterOrders(sortOrders(orders)).filter(o =>
    o.id.toString().includes(search) || o.table.toString().includes(search)
  );

  // Mini Graphs Data
  const deliveryTimeData = history
    .filter(order => {
      const today = new Date().toDateString();
      return new Date(order.servedAt).toDateString() === today;
    })
    .map(order => ({
      time: new Date(order.servedAt).getHours(),
      deliveryTime: order.deliveryTime,
    }));

  const ordersPerHourData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    orders: history.filter(order => new Date(order.servedAt).getHours() === i).length,
  }));

  function StatsBar() {
    return (
      <motion.div
        className="flex gap-8 my-4 mb-7 bg-gradient-to-r rounded-2xl shadow-lg p-4 justify-center items-center text-lg"
        style={statsSpring}
        animate={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="flex items-center gap-2 bg-opacity-20 rounded-lg p-2 px-4 text-base">
          <Clock size={18} /> <b className="text-lg">{stats.totalOrders}</b> Orders
        </div>
        <div className="flex items-center gap-2 bg-opacity-20 rounded-lg p-2 px-4 text-base">
          <Zap size={18} /> <b className="text-lg">{stats.assignedOrders}</b> Assigned
        </div>
        <div className="flex items-center gap-2 bg-opacity-20 rounded-lg p-2 px-4 text-base">
          <Award size={18} /> <b className="text-lg">{stats.completedToday}</b> Served Today
        </div>
        <div className="flex items-center gap-2 bg-opacity-20 rounded-lg p-2 px-4 text-base">
          <TrendingUp size={18} /> <b className="text-lg">{stats.avgDeliveryTime || 0} min</b> Avg Delivery
        </div>
      </motion.div>
    );
  }

  function TablesView() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tables.map(table => (
          <div
            key={table.table}
            className={`backdrop-blur-lg bg-white/30 border border-gray-200/50 rounded-2xl p-5 shadow-lg transition-all duration-300 
              ${table.status === 'Help Requested' ? 'ring-2 ring-red-400' : ''}`}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Table {table.table}</h3>
            <p className={`text-sm mb-3 ${table.status === 'Help Requested' ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              Status: {table.status}
            </p>
            <div className="flex flex-wrap gap-2">
              {table.status === 'Awaiting Delivery' && (
                <button
                  onClick={() => handleDeliver(table.table)}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-lg font-bold text-sm py-2 px-4 shadow-lg hover:scale-105 transition-all"
                >
                  📦 Deliver
                </button>
              )}
              {table.status === 'Needs Cleaning' && (
                <button
                  onClick={() => handleClear(table.table)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-bold text-sm py-2 px-4 shadow-lg hover:scale-105 transition-all"
                >
                  🧹 Clear
                </button>
              )}
              {table.status === 'Help Requested' && (
                <button
                  onClick={() => handleAssist(table.table)}
                  className="bg-gradient-to-r from-red-500 to-pink-400 text-white rounded-lg font-bold text-sm py-2 px-4 shadow-lg hover:scale-105 transition-all"
                >
                  🆘 Assist
                </button>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  function NotificationsView() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 font-medium">No notifications available.</div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`backdrop-blur-lg bg-white/30 border border-gray-200/50 rounded-2xl p-4 shadow-lg 
                ${notif.priority === 'urgent' ? 'ring-2 ring-red-400' : notif.priority === 'high' ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-sm ${notif.priority === 'urgent' ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                  {notif.message}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </motion.div>
    );
  }

  // ...rest of your dashboard UI, including rendering WaiterSidebar, WaiterOrdersList, WaiterProfile, StatsBar, etc.

  return (
    <div>
      <Toaster />
      {/* Add your sidebar, header, and view toggles here */}
      {/* Example: */}
      <StatsBar />
      {view === 'orders' && (
        <WaiterOrdersList
          orders={filtered}
          assigned={assigned}
          onAssign={handleAssign}
          onServe={handleServe}
          loading={loading}
          refreshing={refreshing}
          onRefresh={() => fetchOrders(true)}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          search={search}
          setSearch={setSearch}
        />
      )}
      {view === 'tables' && <TablesView />}
      {view === 'notifications' && <NotificationsView />}
      {/* ...other views/components as needed */}
    </div>
  );
}
