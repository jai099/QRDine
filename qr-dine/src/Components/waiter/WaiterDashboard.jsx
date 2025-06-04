import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import toast, { Toaster } from 'react-hot-toast';
import { Bell, Search, RefreshCw, Clock, Users, TrendingUp, Award, Zap } from 'lucide-react';
import './WaiterDashboard.css';
import './WaiterOrderCard.css';
import './WaiterOrdersList.css';
import './WaiterSidebar.css';
import './WaiterProfile.css';
import WaiterSidebar from './WaiterSidebar.jsx';
import WaiterOrdersList from './WaiterOrdersList';
import WaiterProfile from './WaiterProfile.jsx';

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
  // Simulate API delay for loading animation
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Replace with: await fetch('/api/orders?status=ready').then(r => r.json())
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
      readyAt: Date.now() - 1000 * 60 * 3, // 3 min ago
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
      readyAt: Date.now() - 1000 * 60 * 7, // 7 min ago
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
      readyAt: Date.now() - 1000 * 60 * 1, // 1 min ago
      status: 'ready',
      assignedTo: null,
      priority: 'low',
      estimatedDeliveryTime: 2
    }
  ];
  
  // Sort by priority and time
  return orders.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.readyAt - a.readyAt;
  });
}

export default function WaiterDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [assigned, setAssigned] = useState([]); // order IDs
  const [view, setView] = useState('orders'); // 'orders' | 'history' | 'profile'
  const [history, setHistory] = useState(getInitialHistory());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    assignedOrders: 0,
    completedToday: 0,
    avgDeliveryTime: 0
  });
  const [notifications, setNotifications] = useState([]);
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
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalOrders: newOrders.length,
        assignedOrders: assigned.length
      }));
      
      // Check for new orders and notify
      if (orders.length > 0 && newOrders.length > orders.length) {
        const newOrdersCount = newOrders.length - orders.length;
        toast.success(`🔔 ${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} ready!`, {
          duration: 4000,
          icon: '🍽️'
        });
        
        // Play notification sound
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
    
    // Set up auto-refresh every 30 seconds
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
    
    // Update stats
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
      deliveryTime: Math.floor((Date.now() - order.readyAt) / 60000) // in minutes
    };
    
    setHistory(hist => [servedOrder, ...hist]);
    
    toast.success(`🎉 Order #${orderId} served successfully!`, {
      duration: 4000,
      icon: '🍽️'
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      assignedOrders: Math.max(0, prev.assignedOrders - 1),
      completedToday: prev.completedToday + 1,
      avgDeliveryTime: Math.round((prev.avgDeliveryTime * (prev.completedToday) + servedOrder.deliveryTime) / (prev.completedToday + 1))
    }));

