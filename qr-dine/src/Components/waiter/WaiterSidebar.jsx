import React from 'react';

export default function WaiterSidebar({ view, setView }) {
  return (
    <aside className="w-[220px] bg-warm-100 border-r-2 border-amber-300 flex flex-col items-center pt-8 shadow-[4px_0_24px_rgba(255,152,0,0.07)] md:w-[100px] md:pt-4">
      <div className="text-2xl font-extrabold text-orange-500 mb-8 tracking-widest md:text-lg md:mb-4.5">
        🍽️ QRDine
      </div>
      <nav className="w-full">
        <button
          className={`bg-transparent border-none text-orange-600 font-bold text-lg m-2.5 px-6 py-2.5 rounded-lg cursor-pointer w-full text-left transition-all duration-200 hover:bg-warm-200 hover:text-orange-500 ${view === 'orders' ? 'bg-warm-200 text-orange-500' : ''} md:text-base`}
          onClick={() => setView('orders')}
        >
          🏠 Orders
        </button>
        <button
          className={`bg-transparent border-none text-orange-600 font-bold text-lg m-2.5 px-6 py-2.5 rounded-lg cursor-pointer w-full text-left transition-all duration-200 hover:bg-warm-200 hover:text-orange-500 ${view === 'history' ? 'bg-warm-200 text-orange-500' : ''} md:text-base`}
          onClick={() => setView('history')}
        >
          🧾 History
        </button>
        <button
          className={`bg-transparent border-none text-orange-600 font-bold text-lg m-2.5 px-6 py-2.5 rounded-lg cursor-pointer w-full text-left transition-all duration-200 hover:bg-warm-200 hover:text-orange-500 ${view === 'profile' ? 'bg-warm-200 text-orange-500' : ''} md:text-base`}
          onClick={() => setView('profile')}
        >
          🙍‍♂️ Profile
        </button>
        <button
          className="bg-transparent border-none text-orange-600 font-bold text-lg m-2.5 px-6 py-2.5 rounded-lg cursor-pointer w-full text-left transition-all duration-200 hover:bg-warm-200 hover:text-orange-500 md:text-base"
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
}