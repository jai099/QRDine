import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function WaiterOrderCard({ order, assigned, onAssign, onServe, isHistory, waiterName }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function timeSince(ts) {
    const min = Math.floor((Date.now() - ts) / 60000);
    return min === 0 ? 'Just now' : `${min} min ago`;
  }

  const priorityBadge = {
    low: 'bg-green-100 text-green-600 ring-green-500/20',
    medium: 'bg-yellow-100 text-yellow-700 ring-yellow-500/20',
    high: 'bg-red-100 text-red-600 ring-red-500/20',
  };

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.02, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`relative backdrop-blur-lg bg-white/30 border border-gray-200/50 rounded-2xl p-5 shadow-lg transition-all duration-300 
        ${assigned ? 'ring-2 ring-green-400 shadow-[0_0_16px_rgba(34,197,94,0.3)]' : ''} 
        ${isHistory ? 'border-gray-300 bg-gray-100/50 shadow-sm' : 'border-white/20'}`}
    >
      {/* Header: Order ID, Table No, Time */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 text-gray-800">
        <div className="flex items-center gap-3 font-bold text-lg">
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-base">#{order.id}</span>
          <span className="font-extrabold text-xl text-gray-900">Table {order.table}</span>
        </div>
        <span className="text-sm text-gray-500 sm:text-base">
          {isHistory ? new Date(order.servedAt).toLocaleString() : timeSince(order.readyAt)}
        </span>
      </div>

      {/* Progress Bar for Order Readiness */}
      {!isHistory && (
        <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="absolute h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((Date.now() - order.readyAt) / (1000 * 60 * 5), 1) * 100}%` }}
          />
        </div>
      )}

      {/* Order Items */}
      <div className="flex flex-wrap gap-2 mb-3">
        {order.items.map((item, idx) => (
          <span
            key={idx}
            className="bg-orange-50 text-orange-700 rounded-lg px-3 py-1 text-sm font-semibold shadow-sm"
          >
            {item.name} × {item.qty}
          </span>
        ))}
      </div>

      {/* Expandable Details */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="text-gray-600 text-sm mb-3 flex items-start gap-2">
          📝 <span>{order.notes || 'No notes'}</span>
        </div>
        <div className="flex flex-col gap-2 text-gray-600 mb-3">
          <div className="flex items-center gap-2 text-sm">
            👨‍🍳 <span>{order.chef}</span>
          </div>
          {isHistory && (
            <div className="text-sm text-gray-500 italic">By: {order.waiter || waiterName}</div>
          )}
        </div>
      </motion.div>

      {/* Footer: Status, Priority, and Expand Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-gray-600">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-lg font-bold text-white text-sm 
              ${isHistory ? 'bg-gray-500' : 'bg-green-500'}`}
          >
            {isHistory ? 'Served' : 'Ready to Serve'}
          </span>
          {order.priority && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset 
                ${priorityBadge[order.priority.toLowerCase()] || 'bg-gray-200 text-gray-700'}`}
            >
              Priority: {order.priority}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Action Buttons */}
      {!isHistory && (
        <div className="flex mt-4 gap-3 flex-wrap">
          {!assigned ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-lg font-bold text-sm py-2 px-5 shadow-lg hover:shadow-xl transition-all"
              onClick={() => onAssign(order.id)}
            >
              Assign to Me
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-lg font-bold text-sm py-2 px-5 shadow-lg hover:shadow-xl transition-all"
              onClick={() => onServe(order.id)}
            >
              Mark as Served
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}