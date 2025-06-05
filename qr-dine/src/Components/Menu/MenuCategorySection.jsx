import React from 'react';

export default function MenuCategorySection({ cat, sectionRefs, getQty, decreaseQty, addToCart, tableNumber }) {
  return (
    <section
      key={cat.category}
      ref={el => (sectionRefs.current[cat.category] = el)}
      className="bg-transparent rounded-[18px] mb-6 animate-fadeInSection xl:p-[2vw] md:p-[4vw] md:pt-3.5 md:pb-2.5 sm:p-[2vw] sm:pt-1.5 sm:pb-1"
    >
      <h2 className="text-orange-500 text-3xl font-extrabold mb-4 border-b-2 border-amber-300 inline-block pb-1 tracking-widest">
        {cat.category}
      </h2>
      <ul className="list-none p-0 m-0 flex flex-col gap-0">
<<<<<<< HEAD
        {cat.items.map((item) => {
          const isUnavailable = item.isAvailable === false;
          const quantity = getQty(item);

          return (
            <li
              key={item._id || item.name}
              className={`relative flex items-center gap-4 bg-gradient-to-r from-warm-300 to-warm-200 rounded-2xl p-6 mb-3 shadow-[0_2px_10px_rgba(255,152,0,0.07)] transition-all duration-200 hover:shadow-[0_8px_32px_#ff9800cc] hover:scale-[1.03] hover:-translate-y-0.5 hover:z-10 animate-foodCardPop ${
                isUnavailable ? 'blur-sm grayscale opacity-60 pointer-events-none' : ''
              } md:flex-col md:items-start md:gap-1.5 md:p-3 sm:p-2 sm:rounded-xl`}
            >
              {/* Item name and price */}
              <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-center sm:flex-row sm:justify-between">
                <span className="text-orange-600 font-bold text-lg tracking-tight drop-shadow-[0_1px_0_#fffde7] md:text-base sm:text-sm">
                  {item.name}
                </span>
                <span className="text-green-600 font-bold text-base md:text-sm sm:text-[0.92rem]">
                  ₹{item.price}
                </span>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2.5 ml-4 md:ml-0 sm:ml-0 md:gap-2 sm:gap-1">
                <button
                  className="bg-gradient-to-r from-orange-500 to-amber-300 text-white rounded-full w-9 h-9 text-xl font-bold shadow-[0_2px_8px_#ffe0b2] flex items-center justify-center transition duration-200 active:scale-90 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed md:w-7 md:h-7 md:text-base sm:w-6 sm:h-6 sm:text-sm"
                  onClick={() => decreaseQty(item)}
                  disabled={quantity === 0 || isUnavailable}
                >
                  –
                </button>
                <span className="min-w-7 text-center text-base font-bold text-orange-500 tracking-wide md:text-sm sm:text-[0.95rem]">
                  {quantity}
                </span>
                <button
                  className="bg-gradient-to-r from-orange-500 to-amber-300 text-white rounded-full w-9 h-9 text-xl font-bold shadow-[0_2px_8px_#ffe0b2] flex items-center justify-center transition duration-200 active:scale-90 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed md:w-7 md:h-7 md:text-base sm:w-6 sm:h-6 sm:text-sm"
                  onClick={() => addToCart({ ...item, tableNumber })}
                  disabled={isUnavailable}
                >
                  +
                </button>
              </div>

              {/* Overlay for unavailable items */}
              {isUnavailable && (
                <div className="absolute inset-0 bg-white/85 text-red-600 font-bold text-base flex items-center justify-center rounded-[10px] z-10 pointer-events-none md:text-sm sm:text-[0.95rem]">
                  Not available
                </div>
              )}
            </li>
          );
        })}
=======
        {cat.items.map((item) => (
          <li
            key={item._id || item.name}
            className={`relative flex items-center gap-4 bg-gradient-to-r from-warm-300 to-warm-200 rounded-2xl p-6 mb-3 shadow-[0_2px_10px_rgba(255,152,0,0.07)] transition-all duration-200 hover:shadow-[0_8px_32px_#ff9800cc] hover:scale-103 hover:-translate-y-0.5 hover:z-10 animate-foodCardPop ${
              item.isAvailable === false ? 'blur-sm grayscale opacity-60 pointer-events-none' : ''
            } md:flex-col md:items-start md:gap-1.5 md:p-2.5 md:rounded-[10px] sm:p-2 sm:rounded-[8px]`}
          >
            <div className="flex-1 flex flex-col gap-1 md:flex-row md:justify-between md:items-center md:gap-0 sm:flex-row sm:justify-between sm:items-center sm:gap-0">
              <span className="text-orange-600 font-bold text-lg tracking-tight drop-shadow-[0_1px_0_#fffde7] md:text-base sm:text-sm">
                {item.name}
              </span>
              <span className="text-green-600 font-bold text-base tracking-tight md:text-sm sm:text-[0.92rem]">
                ₹{item.price}
              </span>
            </div>
            <div className="flex items-center gap-2.5 ml-4 md:ml-0 sm:ml-0 md:gap-1.5 sm:gap-1">
              <button
                className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-full w-9 h-9 text-xl font-extrabold cursor-pointer shadow-[0_2px_8px_#ffe0b2] flex items-center justify-center transition-all duration-200 active:scale-90 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed md:w-7 md:h-7 md:text-base sm:w-6 sm:h-6 sm:text-sm"
                onClick={() => decreaseQty(item)}
                disabled={getQty(item) === 0 || item.isAvailable === false}
              >
                -
              </button>
              <span className="min-w-7 text-center text-base font-bold text-orange-500 tracking-wide md:min-w-[18px] md:text-sm sm:min-w-[14px] sm:text-[0.95rem]">
                {getQty(item)}
              </span>
              <button
                className="bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-full w-9 h-9 text-xl font-extrabold cursor-pointer shadow-[0_2px_8px_#ffe0b2] flex items-center justify-center transition-all duration-200 active:scale-90 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed md:w-7 md:h-7 md:text-base sm:w-6 sm:h-6 sm:text-sm"
                onClick={() => addToCart({ ...item, tableNumber })}
                disabled={item.isAvailable === false}
              >
                +
              </button>
            </div>
            {item.isAvailable === false && (
              <div className="absolute inset-0 bg-white/85 text-red-600 font-bold text-base flex items-center justify-center rounded-[10px] z-10 pointer-events-none tracking-wide md:text-sm sm:text-[0.95rem]">
                Not available
              </div>
            )}
          </li>
        ))}
>>>>>>> c301c500d2e15017bdcfe3d79ee1efbb1a8a6bd8
      </ul>
    </section>
  );
}
