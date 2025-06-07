import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import toast, { Toaster } from 'react-hot-toast';
import { Search, RefreshCw, Clock, TrendingUp, Award, Zap, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import WaiterSidebar from './WaiterSidebar.jsx';
import WaiterOrdersList from './WaiterOrdersList';
import WaiterProfile from './WaiterProfile.jsx';
import ThreeBackground from '../ThreeJS/ThreeBackground';

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
  return mockSupabaseClient.orders.sort((a, b) => {
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
          icon: '🍽️',
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
    const order = orders.find(o => o.id === orderId);
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
      icon: '🍽️',
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

  return (
    <div className={`relative min-h-screen bg-transparent font-sans theme-${theme}`}>
      <ThreeBackground />
      <Toaster position="top-right" />
      <div className="flex min-h-screen">
        <WaiterSidebar view={view} setView={setView} notificationsCount={notifications.length} />
        <main className="flex-1 p-9 flex flex-col min-w-0 bg-white/90 rounded-tl-[32px] rounded-bl-[32px] shadow-lg my-6 backdrop-blur-xl border-l-4 border-orange-200">
          <animated.div
            className="flex items-center justify-between mb-6 bg-gradient-to-r from-orange-100/80 to-amber-100/80 rounded-2xl shadow-lg p-6 border-b-2 border-orange-200"
            style={headerSpring}
          >
            <div className="flex items-center gap-4">
              <img
                src={require('../../Assets/Menu/logoimage.jpg')}
                alt="Logo"
                className="w-14 h-14 rounded-full shadow-lg border-2 border-orange-300 animate-spin-slow"
              />
              <h2 className="text-3xl font-extrabold text-orange-600 drop-shadow">Waiter Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="bg-orange-100/70 border border-orange-300 rounded-lg p-2 text-sm font-semibold text-orange-700 shadow-sm focus:ring-2 focus:ring-orange-400"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="dark">Dark</option>
              </select>
              <div className="hidden md:flex items-center bg-orange-50/80 rounded-lg p-1 px-2.5 gap-1.5 border border-orange-200 shadow-sm">
                <Search size={18} className="text-orange-500" />
                <input
                  className="bg-transparent font-medium text-sm outline-none text-orange-700"
                  placeholder="Search by table or ID"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </animated.div>

          {view === 'orders' && (
            <>
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mr-2 text-orange-700">Sort by:</label>
                  <select
                    className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-sm text-orange-700 font-semibold shadow-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="priority">Priority</option>
                    <option value="chef">Chef</option>
                    <option value="table">Table</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mr-2 text-orange-700">Filter by:</label>
                  <select
                    className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-sm text-orange-700 font-semibold shadow-sm"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value="all">All Orders</option>
                    <option value="highPriority">High Priority</option>
                    <option value="assigned">My Assigned</option>
                  </select>
                </div>
              </div>
              <StatsBar />
            </>
          )}

          {view === 'orders' && (
            <div className="mb-6">
              <button
                className="flex items-center gap-2 text-lg font-semibold mb-2 text-orange-700 hover:text-orange-900 transition-all"
                onClick={() => setShowInsights(!showInsights)}
              >
                Today's Insights <ChevronDown size={20} className={showInsights ? 'rotate-180' : ''} />
              </button>
              {showInsights && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-orange-50/80 p-4 rounded-lg border border-orange-200 shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-orange-700">Delivery Time Trend</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={deliveryTimeData}>
                          <XAxis dataKey="time" label={{ value: 'Hour', position: 'bottom' }} />
                          <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="deliveryTime" stroke="#ff9800" strokeWidth={3} dot={{ r: 5, fill: '#ff9800' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-orange-700">Orders Served Per Hour</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={ordersPerHourData}>
                          <XAxis dataKey="hour" label={{ value: 'Hour', position: 'bottom' }} />
                          <YAxis label={{ value: 'Orders', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="orders" stroke="#43ea5e" strokeWidth={3} dot={{ r: 5, fill: '#43ea5e' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <AnimatePresence>
            {view === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  <div className="text-center font-bold text-xl mt-12 animate-pulse text-orange-600">
                    Loading orders...
                  </div>
                ) : (
                  <WaiterOrdersList
                    orders={filtered}
                    assigned={assigned}
                    onAssign={handleAssign}
                    onServe={handleServe}
                    isHistory={false}
                    waiterName={WAITER_PROFILE.name}
                  />
                )}
              </motion.div>
            )}
            {view === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <WaiterOrdersList
                  orders={history}
                  assigned={[]}
                  onAssign={() => {}}
                  onServe={() => {}}
                  isHistory={true}
                  waiterName={WAITER_PROFILE.name}
                />
              </motion.div>
            )}
            {view === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <WaiterProfile profile={WAITER_PROFILE} ordersServed={history.length} />
              </motion.div>
            )}
            {view === 'tables' && <TablesView />}
            {view === 'notifications' && <NotificationsView />}
          </AnimatePresence>

          <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-4 z-50">
            <button
              className="bg-gradient-to-r from-orange-500 to-amber-400 p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-200 border-2 border-orange-300"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
            >
              <RefreshCw size={24} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              className="bg-gradient-to-r from-orange-500 to-amber-400 p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-200 border-2 border-orange-300"
              onClick={() => setSearch('')}
            >
              <Search size={24} />
            </button>
          </div>

          <audio ref={audioRef} src="/notification.mp3" preload="auto" style={{ display: 'none' }} />
        </main>
      </div>
    </div>
  );
}