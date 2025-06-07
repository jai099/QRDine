import React from 'react';
import { motion } from 'framer-motion';

export default function WaiterOrdersList({ orders, assigned, onAssign, onServe, isHistory, waiterName }) {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 font-medium">
          {isHistory ? 'No history available.' : 'No orders available.'}
        </div>
      ) : (
        orders.map(order => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-opacity-10 p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id} - Table {order.table}</h3>
                <p className="text-sm text-gray-500">
                  {order.items.map(item => `${item.name} x${item.qty}`).join(', ')}
                </p>
                {order.notes && <p className="text-sm text-gray-500">Notes: {order.notes}</p>}
                <p className="text-sm text-gray-500">Chef: {order.chef}</p>
                {isHistory && (
                  <>
                    <p className="text-sm text-gray-500">Served by: {waiterName}</p>
                    <p className="text-sm text-gray-500">
                      Delivery Time: {order.deliveryTime} min
                    </p>
                  </>
                )}
                {!isHistory && (
                  <p className="text-sm text-gray-500">Priority: {order.priority}</p>
                )}
              </div>
              {!isHistory && (
                <div className="flex gap-2">
                  {!assigned.includes(order.id) ? (
                    <button
                      onClick={() => onAssign(order.id)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                    >
                      Assign
                    </button>
                  ) : (
                    <button
                      onClick={() => onServe(order.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Serve
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}