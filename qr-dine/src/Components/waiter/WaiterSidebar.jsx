import React from 'react';

export default function WaiterSidebar({ view, setView }) {
  return (
    <aside className="w-[220px] bg-amber-50 border-r-2 border-amber-300 flex flex-col items-center pt-8 shadow-[4px_0_24px_rgba(255,152,0,0.07)] md:w-[100px] md:pt-6 md:gap-2">
      {/* Dashboard Title */}
      <div className="text-2xl font-extrabold text-orange-500 mb-10 tracking-widest md:text-lg md:mb-6 text-center">
        Waiter Dashboard
      </div>

      {/* Navigation Menu */}
      <nav className="w-full flex flex-col items-start px-4 gap-3">
        <button
          className={`text-orange-600 font-bold text-lg w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200 hover:bg-amber-100 hover:text-orange-500 ${
            view === 'orders' ? 'bg-amber-200 text-orange-700' : ''
          } md:text-base`}
          onClick={() => setView('orders')}
        >
          🏠 Orders
        </button>

        <button
          className={`text-orange-600 font-bold text-lg w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200 hover:bg-amber-100 hover:text-orange-500 ${
            view === 'history' ? 'bg-amber-200 text-orange-700' : ''
          } md:text-base`}
          onClick={() => setView('history')}
        >
          🧾 History
        </button>

        <button
          className={`text-orange-600 font-bold text-lg w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200 hover:bg-amber-100 hover:text-orange-500 ${
            view === 'profile' ? 'bg-amber-200 text-orange-700' : ''
          } md:text-base`}
          onClick={() => setView('profile')}
        >
          🙍‍♂️ Profile
        </button>

        <button
          className="text-orange-600 font-bold text-lg w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200 hover:bg-amber-100 hover:text-orange-500 md:text-base"
          onClick={() => alert('Logged out')} // Replace with actual logout
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
}
