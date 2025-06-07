import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import toast, { Toaster } from 'react-hot-toast';
import { Search, RefreshCw, Clock, TrendingUp, Award, Zap, Menu } from 'lucide-react';
import WaiterSidebar from './WaiterSidebar.jsx';
import WaiterOrdersList from './WaiterOrdersList';
import WaiterProfile from './WaiterProfile.jsx';
<<<<<<< HEAD
=======

// PWA Manifest and Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.error('Service Worker registration failed:', err));
  });
}
>>>>>>> dc7cf984d9ec9887b7c9bcc56f62507cb07a501e

function getInitialHistory() {
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
  await new Promise(resolve => setTimeout(resolve, 800));
  const orders = [
    {
      id: 201,
      table: 5,
      items: [
        { name: 'Paneer Butter Masala', qty: 2 },
        { name: 'Butter Naan', qty: 4 }
      ],
      notes: 'No onion',
      chef: 'Chef Arjun',
      readyAt: Date.now() - 1000 * 60 * 3,
      status: 'ready',
      assignedTo: null,
      priority: 'high',
      estimatedDeliveryTime: 5
    },
    {
      id: 202,
      table: 2,
      items: [
        { name: 'Chicken Biryani', qty: 1 }
      ],
      notes: '',
      chef: 'Chef Priya',
      readyAt: Date.now() - 1000 * 60 * 7,
      status: 'ready',
      assignedTo: null,
      priority: 'medium',
      estimatedDeliveryTime: 3
    },
    {
      id: 203,
      table: 8,
      items: [
        { name: 'Masala Dosa', qty: 2 },
        { name: 'Filter Coffee', qty: 2 }
      ],
      notes: 'Extra sambar',
      chef: 'Chef Ravi',
      readyAt: Date.now() - 1000 * 60 * 1,
      status: 'ready',
      assignedTo: null,
      priority: 'low',
      estimatedDeliveryTime: 2
    }
  ];
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return orders.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.readyAt - a.readyAt;
  });
}

export default function WaiterDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [assigned, setAssigned] = useState([]);
  const [view, setView] = useState('orders');
  const [history, setHistory] = useState(getInitialHistory());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    assignedOrders: 0,
    completedToday: 0,
    avgDeliveryTime: 0
  });
  const refreshIntervalRef = useRef(null);
  const audioRef = useRef(null);

  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 }
  });
  const statsSpring = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    delay: 200,
    config: { tension: 300, friction: 25 }
  });

  const fetchOrders = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const newOrders = await fetchReadyOrders();
      setOrders(newOrders);
      setStats(prev => ({
        ...prev,
        totalOrders: newOrders.length,
        assignedOrders: assigned.length
      }));
      if (orders.length > 0 && newOrders.length > orders.length) {
        const newOrdersCount = newOrders.length - orders.length;
        toast.success(`🔔 ${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} ready!`, {
          duration: 4000,
          icon: '🍽️'
        });
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, [orders.length, assigned.length]);

  useEffect(() => {
    fetchOrders();
    refreshIntervalRef.current = setInterval(() => {
      fetchOrders(false);
    }, 30000);
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchOrders]);

  useEffect(() => {
    saveHistory(history);
    setStats(prev => ({
      ...prev,
      completedToday: history.filter(order => {
        const today = new Date().toDateString();
        return new Date(order.servedAt).toDateString() === today;
      }).length
    }));
  }, [history]);

  function handleAssign(orderId) {
    setAssigned(ids => [...ids, orderId]);
    toast.success(`🎯 Order #${orderId} assigned to you!`, {
      duration: 3000,
      icon: '✅'
    });
    setStats(prev => ({
      ...prev,
      assignedOrders: prev.assignedOrders + 1
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
      deliveryTime: Math.floor((Date.now() - order.readyAt) / 60000)
    };
    setHistory(hist => [servedOrder, ...hist]);
    toast.success(`🎉 Order #${orderId} served successfully!`, {
      duration: 4000,
      icon: '🍽️'
    });
    setStats(prev => ({
      ...prev,
      assignedOrders: Math.max(0, prev.assignedOrders - 1),
      completedToday: prev.completedToday + 1,
      avgDeliveryTime: Math.round((prev.avgDeliveryTime * (prev.completedToday) + servedOrder.deliveryTime) / (prev.completedToday + 1))
    }));
  }

  const filtered = orders.filter(o =>
    o.id.toString().includes(search) || o.table.toString().includes(search)
  );

  function StatsBar() {
    return (
      <animated.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5 bg-gradient-to-r from-amber-300 to-warm-300 rounded-2xl shadow-[0_2px_8px_#ffe0b2] p-4 justify-center items-center text-orange-600 font-bold text-lg animate-statsGlow"
        style={statsSpring}
      >
        <div className="flex items-center gap-2 bg-warm-100 rounded-lg p-2 shadow-md text-base">
          <Clock size={18} /> <span>{stats.totalOrders}</span> Orders
        </div>
        <div className="flex items-center gap-2 bg-warm-100 rounded-lg p-2 shadow-md text-base">
          <Zap size={18} /> <span>{stats.assignedOrders}</span> Assigned
        </div>
        <div className="flex items-center gap-2 bg-warm-100 rounded-lg p-2 shadow-md text-base">
          <Award size={18} /> <span>{stats.completedToday}</span> Served Today
        </div>
        <div className="flex items-center gap-2 bg-warm-100 rounded-lg p-2 shadow-md text-base">
          <TrendingUp size={18} /> <span>{stats.avgDeliveryTime || 0} min</span> Avg Delivery
        </div>
      </animated.div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-warm-300 to-warm-200 font-sans animate-waiterBgAnim">
      <Toaster position="top-right" />
      <div className="md:hidden flex justify-between p-4 bg-orange-100">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={28} className="text-orange-600" />
        </button>
        <h1 className="text-xl font-bold text-orange-600">Waiter Dashboard</h1>
      </div>
      {sidebarOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <WaiterSidebar view={view} setView={setView} />
        </div>
      )}
      <div className="hidden md:block">
        <WaiterSidebar view={view} setView={setView} />
      </div>
      <main className="flex-1 p-6 flex flex-col min-w-0 bg-white/85 rounded-tl-3xl rounded-bl-3xl shadow-xl md:p-4">
        <animated.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-4 bg-gradient-to-r from-warm-300 to-warm-200 rounded-2xl shadow-md p-4"
          style={headerSpring}
        >
          <h2 className="text-xl md:text-2xl font-extrabold text-orange-500 mb-2 md:mb-0">Waiter Dashboard</h2>
          <div className="flex flex-col md:flex-row gap-3 items-center">
=======
    <div className={`relative min-h-screen bg-transparent font-sans theme-${theme}`}>
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
                src={require('../../assets/Menu/logoimage.jpg')}
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
>>>>>>> dc7cf984d9ec9887b7c9bcc56f62507cb07a501e
            <button
              className="bg-gradient-to-r from-orange-500 to-amber-300 text-white rounded-lg font-semibold text-sm py-2 px-4 shadow hover:brightness-110 disabled:bg-gray-300"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              title="Refresh"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="flex items-center bg-warm-100 rounded-lg shadow p-2 gap-2">
              <Search size={16} />
              <input
                className="bg-transparent text-orange-600 font-medium text-sm outline-none"
                placeholder="Search by table or ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </animated.div>
        <StatsBar />
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
                <div className="text-center text-orange-500 font-bold text-xl mt-12 animate-pulseText">
                  Loading orders...
                </div>
              ) : (
                <WaiterOrdersList
                  orders={filtered}
                  assigned={assigned}
                  onAssign={handleAssign}
                  onServe={handleServe}
                  isHistory={false}
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
        </AnimatePresence>
        <audio ref={audioRef} src="/notification.mp3" preload="auto" style={{ display: 'none' }} />
      </main>
    </div>
  );
}
