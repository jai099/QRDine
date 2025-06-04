import React from 'react';

const Sidebar = ({ active, onNavigate, chefName }) => (
  <nav className="w-[180px] bg-warm-100 border-r-2 border-amber-300 shadow-[2px_0_12px_#ffe0b2] flex flex-col items-center pt-8 min-h-screen md:flex-row md:w-full md:min-h-[64px] md:h-16 md:p-0 md:border-r-0 md:border-b-2 md:shadow-[0_2px_12px_#ffe0b2] md:justify-center">
    <div className="text-4xl font-extrabold text-orange-500 mb-8 text-center md:text-2xl md:mb-0 md:mr-4.5">
      👨‍🍳<br />{chefName || 'Chef'}
    </div>
    <ul className="list-none p-0 w-full flex flex-col md:flex-row md:w-auto">
      <li
        className={`py-4 text-center text-lg text-orange-600 font-bold cursor-pointer border-l-4 border-transparent transition-all duration-200 hover:bg-amber-300/20 hover:text-orange-500 hover:border-l-orange-500 ${active === 'orders' ? 'bg-amber-300/20 text-orange-500 border-l-orange-500' : ''} md:border-l-0 md:border-b-4 md:px-4.5 md:text-base md:py-0`}
        onClick={() => onNavigate('orders')}
      >
        Orders
      </li>
      <li
        className={`py-4 text-center text-lg text-orange-600 font-bold cursor-pointer border-l-4 border-transparent transition-all duration-200 hover:bg-amber-300/20 hover:text-orange-500 hover:border-l-orange-500 ${active === 'history' ? 'bg-amber-300/20 text-orange-500 border-l-orange-500' : ''} md:border-l-0 md:border-b-4 md:px-4.5 md:text-base md:py-0`}
        onClick={() => onNavigate('history')}
      >
        History
      </li>
      <li
        className={`py-4 text-center text-lg text-orange-600 font-bold cursor-pointer border-l-4 border-transparent transition-all duration-200 hover:bg-amber-300/20 hover:text-orange-500 hover:border-l-orange-500 ${active === 'profile' ? 'bg-amber-300/20 text-orange-500 border-l-orange-500' : ''} md:border-l-0 md:border-b-4 md:px-4.5 md:text-base md:py-0`}
        onClick={() => onNavigate('profile')}
      >
        Profile
      </li>
      <li
        className={`py-4 text-center text-lg text-orange-600 font-bold cursor-pointer border-l-4 border-transparent transition-all duration-200 hover:bg-amber-300/20 hover:text-orange-500 hover:border-l-orange-500 ${active === 'logout' ? 'bg-amber-300/20 text-orange-500 border-l-orange-500' : ''} md:border-l-0 md:border-b-4 md:px-4.5 md:text-base md:py-0`}
        onClick={() => onNavigate('logout')}
      >
        Logout
      </li>
    </ul>
  </nav>
);

export default Sidebar;