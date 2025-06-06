import React, { useState } from 'react';

export default function WaiterSidebar({ view, setView }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-[220px] bg-amber-50 border-r border-orange-200 pt-8 px-3 shadow-[4px_0_24px_rgba(255,152,0,0.07)]">
        <div className="text-2xl font-bold text-orange-600 mb-10 text-center">Waiter Dashboard</div>
        <nav className="flex flex-col gap-4">
          {['orders', 'history', 'profile'].map(item => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`text-left px-5 py-2.5 text-lg font-semibold rounded-md hover:bg-amber-100 transition-all ${
                view === item ? 'bg-amber-200 text-orange-700' : 'text-orange-600'
              }`}
            >
              {item === 'orders' && '🏠 Orders'}
              {item === 'history' && '🧾 History'}
              {item === 'profile' && '🙍‍♂️ Profile'}
            </button>
          ))}
          <button
            onClick={() => alert('Logout')}
            className="text-left px-5 py-2.5 text-lg font-semibold text-orange-600 rounded-md hover:bg-amber-100 transition-all"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Sidebar for mobile */}
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-50 text-orange-600 text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        {isOpen && (
          <div className="fixed top-0 left-0 h-full w-[200px] bg-amber-50 z-40 shadow-lg p-5">
            <div className="text-xl font-bold text-orange-600 mb-6">Waiter Dashboard</div>
            <nav className="flex flex-col gap-4">
              {['orders', 'history', 'profile'].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    setView(item);
                    setIsOpen(false);
                  }}
                  className={`text-left px-4 py-2 text-base font-medium rounded-md hover:bg-amber-100 ${
                    view === item ? 'bg-amber-200 text-orange-700' : 'text-orange-600'
                  }`}
                >
                  {item === 'orders' && '🏠 Orders'}
                  {item === 'history' && '🧾 History'}
                  {item === 'profile' && '🙍‍♂️ Profile'}
                </button>
              ))}
              <button
                onClick={() => alert('Logout')}
                className="text-left px-4 py-2 text-base font-medium text-orange-600 rounded-md hover:bg-amber-100"
              >
                🚪 Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
