import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import AddMenuItemModal from './AddMenuItemModal.jsx';


const CHEF_NAME = localStorage.getItem('chefName') || 'Chef';
const STATUS_FLOW = ['Placed', 'Preparing', 'Ready', 'Completed'];

const getOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem('chefOrders'));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
};

const ChefDashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState(getOrders());
  const [modalOrder, setModalOrder] = useState(null);
  const [chefName] = useState(CHEF_NAME);
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(getOrders());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = (orderId) => {
    const updated = orders.map(order =>
      order.id === orderId && !order.chef
        ? { ...order, chef: chefName, status: 'Preparing', acceptedAt: Date.now() }
        : order
    );
    setOrders(updated);
    localStorage.setItem('chefOrders', JSON.stringify(updated));
  };

  const updateStatus = (orderId) => {
    const updated = orders.map(order => {
      if (order.id === orderId && order.chef === chefName) {
        const idx = STATUS_FLOW.indexOf(order.status);
        if (idx !== -1 && idx < STATUS_FLOW.length - 1) {
          return { ...order, status: STATUS_FLOW[idx + 1], updatedAt: Date.now() };
        }
      }
      return order;
    });
    setOrders(updated);
    localStorage.setItem('chefOrders', JSON.stringify(updated));
  };

  const getElapsed = (placed) => {
    if (!placed) return '0s';
    const sec = Math.floor((Date.now() - placed) / 1000);
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m ${sec % 60}s`;
    return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  };

  const handleAddMenuItem = () => {
    setShowAddModal(true);
  };

  const onAddMenuItem = (item) => {
    const updatedMenu = [...menu, item];
    setMenu(updatedMenu);
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu));
  };

  if (!chefName) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center font-sans text-orange-700 text-lg">
        Please log in as a chef.
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Sidebar active={activeTab} onNavigate={setActiveTab} chefName={chefName} />

      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-orange-600 text-center mb-6">Live Orders</h1>
            {orders.filter(o => o.status !== 'Completed').length === 0 ? (
              <div className="text-center text-orange-500 font-medium text-lg">No live orders.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.filter(o => o.status !== 'Completed').map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg p-5 border border-orange-100">
                    <div className="flex justify-between mb-2 font-semibold text-orange-700">
                      <span>Order #{order.id}</span>
                      <span>Table: {order.table || 'N/A'}</span>
                    </div>
                    <ul className="mb-3 space-y-1">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex justify-between text-sm text-orange-800">
                          <span>{item.name}</span>
                          <span>x{item.qty || item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    {order.notes && (
                      <div className="text-sm text-orange-600 mb-2">📝 {order.notes}</div>
                    )}
                    <div className="text-sm text-orange-600 space-y-1 mb-2">
                      <p>Status: <strong>{order.status}</strong></p>
                      <p>Chef: {order.chef || <i>Unassigned</i>}</p>
                      <p>⏱ {getElapsed(order.acceptedAt || order.id)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!order.chef && (
                        <button
                          onClick={() => acceptOrder(order.id)}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-1.5 px-4 rounded-md transition duration-200"
                        >
                          Accept
                        </button>
                      )}
                      {order.chef === chefName && order.status !== 'Completed' && (
                        <button
                          onClick={() => updateStatus(order.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-1.5 px-4 rounded-md transition duration-200"
                        >
                          Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(order.status || 'Placed') + 1] || 'Completed'}
                        </button>
                      )}
                      <button
                        onClick={() => setModalOrder(order)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-orange-700 font-medium py-1.5 px-4 rounded-md transition duration-200"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Order History */}
        {activeTab === 'history' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-orange-600 text-center mb-6">Order History</h1>
            {orders.filter(o => o.status === 'Completed' && o.chef === chefName).length === 0 ? (
              <div className="text-center text-orange-500 font-medium text-lg">No completed orders.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders
                  .filter(o => o.status === 'Completed' && o.chef === chefName)
                  .map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-4 border border-orange-100">
                      <div className="font-semibold text-orange-700 mb-2">Order #{order.id}</div>
                      <ul className="text-sm text-orange-800 mb-2">
                        {order.items.map((item, i) => (
                          <li key={i}>{item.name} x{item.qty || item.quantity}</li>
                        ))}
                      </ul>
                      <div className="text-sm text-orange-600">Table: {order.table || 'N/A'}</div>
                      <div className="text-sm text-orange-600">Completed at: {new Date(order.updatedAt || Date.now()).toLocaleString()}</div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto text-orange-700">
            <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">Chef Profile</h1>
            <div className="bg-white shadow-md rounded-xl p-6 border border-orange-100">
              <div className="text-lg font-semibold mb-2">👨‍🍳 Name:</div>
              <p className="mb-4">{chefName}</p>

              <div className="text-lg font-semibold mb-2">🛠️ Orders handled:</div>
              <p className="mb-4">{orders.filter(o => o.chef === chefName).length}</p>

              <div className="text-lg font-semibold mb-2">✅ Completed orders:</div>
              <p className="mb-4">{orders.filter(o => o.chef === chefName && o.status === 'Completed').length}</p>
            </div>
          </div>
        )}

     {/* Menu Management */}
{activeTab === 'menu' && (
  <>
    <h1 className="text-3xl md:text-4xl font-bold text-orange-600 text-center mb-6">
      Menu Management
    </h1>

    <div className="flex justify-end mb-4">
  {!showForm ? (
    <button
      onClick={() => setShowForm(true)}
      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md"
    >
      ➕ Add Menu Item
    </button>
  ) : (
    <div className="w-full bg-orange-50 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-orange-700 mb-3">Add New Menu Item</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border border-orange-300 p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border border-orange-300 p-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="border border-orange-300 p-2 rounded"
        />
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => setShowForm(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!newItem.name || !newItem.price || !newItem.category || isNaN(newItem.price)) {
              return alert("Invalid input");
            }

            const updatedMenu = [...menu, {
              ...newItem,
              price: parseFloat(newItem.price),
              name: newItem.name.trim(),
              category: newItem.category.trim(),
            }];
            setMenu(updatedMenu);
            localStorage.setItem('menuItems', JSON.stringify(updatedMenu));
            setNewItem({ name: '', price: '', category: '' });
            setShowForm(false);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Save Item
        </button>
      </div>
    </div>
  )}
</div>
  </>
)}


        {/* Order Modal */}
        {modalOrder && (
          <div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={() => setModalOrder(null)}
          >
            <div
              className="bg-white max-w-md w-full rounded-lg shadow-2xl p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-orange-700 mb-3">Order #{modalOrder.id}</h2>
              <div className="text-sm text-orange-600 mb-1">Table: {modalOrder.table}</div>
              <ul className="text-sm text-orange-800 space-y-1 mb-3">
                {modalOrder.items.map((item, i) => (
                  <li key={i}>{item.name} x{item.qty || item.quantity}</li>
                ))}
              </ul>
              {modalOrder.notes && <div className="text-sm text-orange-500 mb-2">📝 {modalOrder.notes}</div>}
              <div className="text-sm text-orange-600 mb-2">Status: {modalOrder.status}</div>
              <div className="text-sm text-orange-600 mb-4">Chef: {modalOrder.chef || <i>Unassigned</i>}</div>
              <button
                onClick={() => setModalOrder(null)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChefDashboard;
