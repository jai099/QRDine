import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import toast, { Toaster } from 'react-hot-toast';
import { Search, RefreshCw, Clock, TrendingUp, Award, Zap } from 'lucide-react';
import './WaiterDashboard.css';
import './WaiterOrderCard.css';
import './WaiterOrdersList.css';
import './WaiterSidebar.css';
import './WaiterProfile.css';
import WaiterSidebar from './WaiterSidebar.jsx';
import WaiterOrdersList from './WaiterOrdersList';
import WaiterProfile from './WaiterProfile.jsx';

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
  const [stats, setStats] = useState({
    totalOrders: 0,
    assignedOrders: 0,
    completedToday: 0,
    avgDeliveryTime: 0
  });
  const refreshIntervalRef = useRef(null);
  const audioRef = useRef(null);

  // Animation springs
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

  // Fetch orders with loading state
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

  // Auto-refresh orders
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

  // --- Stats Bar ---
  function StatsBar() {
    return (
      <animated.div className="waiter-stats-bar" style={statsSpring}>
        <div className="waiter-stat"><Clock size={18}/> <b>{stats.totalOrders}</b> Orders</div>
        <div className="waiter-stat"><Zap size={18}/> <b>{stats.assignedOrders}</b> Assigned</div>
        <div className="waiter-stat"><Award size={18}/> <b>{stats.completedToday}</b> Served Today</div>
        <div className="waiter-stat"><TrendingUp size={18}/> <b>{stats.avgDeliveryTime || 0} min</b> Avg Delivery</div>
      </animated.div>
    );
  }

  return (
    <div className="waiter-dashboard-root">
      <Toaster position="top-right" />
      <WaiterSidebar view={view} setView={setView} />
      <main className="waiter-main">
        <animated.div className="waiter-main-header" style={headerSpring}>
          <h2>Waiter Dashboard</h2>
          <div className="waiter-header-actions">
            <button className="waiter-refresh-btn" onClick={()=>fetchOrders(true)} disabled={refreshing} title="Refresh">
              <RefreshCw size={20} className={refreshing ? 'spin' : ''}/> {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="waiter-searchbar">
              <Search size={18}/>
              <input
                className="waiter-search"
                placeholder="Search by table or order ID"
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
                <div className="waiter-loading">Loading orders...</div>
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
                onAssign={()=>{}}
                onServe={()=>{}}
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
        <audio ref={audioRef} src="/notification.mp3" preload="auto" style={{display:'none'}} />
      </main>
    </div>
  );
}