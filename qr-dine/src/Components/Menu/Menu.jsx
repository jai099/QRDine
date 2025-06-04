import React, { useState, useRef, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

const Menu = (props) => {
  const { cart = [], addToCart = () => {}, removeFromCart = () => {}, decreaseQty = () => {} } = props;
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const sectionRefs = useRef({});

  // Fetch menu data from backend
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch menu');
        return res.json();
      })
      .then((data) => {
        const grouped = data.reduce((acc, item) => {
          const cat = item.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {});
        const menuArr = Object.keys(grouped).map((category) => ({
          category,
          items: grouped[category],
        }));
        setMenuData(menuArr);
        setActiveCategory(menuArr[0]?.category || '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Scroll to section when category is clicked
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setTimeout(() => {
      sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Detect scroll and update active category
  useEffect(() => {
    const handleScroll = () => {
      const offsets = menuData
        .map((cat) => {
          const ref = sectionRefs.current[cat.category];
          if (ref) {
            const rect = ref.getBoundingClientRect();
            return { category: cat.category, top: rect.top };
          }
          return null;
        })
        .filter(Boolean);
      const threshold = 60;
      const visible = offsets.filter((o) => o.top <= threshold);
      if (visible.length > 0) {
        setActiveCategory(visible[visible.length - 1].category);
      } else if (menuData.length > 0) {
        setActiveCategory(menuData[0].category);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuData]);

  // Show bottom nav when near bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setShowBottomNav(scrollY + windowHeight >= docHeight - 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuData]);

  const getQty = (item) => {
    const found = cart.find((i) => i.name === item.name);
    return found ? found.qty : 0;
  };

  if (loading) return <div className="w-screen min-h-screen font-sans">Loading menu...</div>;
  if (error) return <div className="w-screen min-h-screen font-sans">Error: {error}</div>;
  if (!menuData.length) return <div className="w-screen min-h-screen font-sans">No menu items found.</div>;

  return (
    <div className="w-screen min-h-screen font-sans bg-gradient-to-r from-warm-300 to-warm-200 pb-10 animate-fadeInBg">
      <h1 className="text-center text-5xl font-extrabold text-orange-500 mb-8 tracking-wider drop-shadow-[0_2px_12px_#ffe0b2,0_1px_0_#fffde7] animate-popIn">
        HOTEL TARS MAHAL
      </h1>
      <div className="sticky top-0 flex justify-center gap-4 mb-7 bg-white py-4 px-0 z-20 rounded-b-3xl shadow-[0_2px_8px_rgba(255,152,0,0.07)] animate-slideDown">
        {menuData.map((cat) => (
          <button
            key={cat.category}
            className={`bg-gradient-to-r from-warm-300 to-amber-300 text-orange-600 font-bold text-base py-3 px-7 rounded-[20px] shadow-[0_2px_8px_#ffe0b2] transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-300 hover:text-white hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_#ff9800cc] ${activeCategory === cat.category ? 'bg-gradient-to-r from-orange-500 to-amber-300 text-white scale-105 -translate-y-0.5 shadow-[0_4px_16px_#ff9800cc]' : ''}`}
            onClick={() => handleCategoryClick(cat.category)}
          >
            {cat.category}
          </button>
        ))}
      </div>
      <div className="max-w-[1100px] mx-auto flex flex-col gap-0 px-[2vw] 2xl:max-w-[900px] xl:max-w-[98vw] md:max-w-full sm:max-w-full sm:px-[1vw]">
        {menuData.map((cat) => (
          <section
            key={cat.category}
            ref={(el) => (sectionRefs.current[cat.category] = el)}
            className="bg-transparent rounded-[18px] mb-6 animate-fadeInSection xl:p-[2vw] md:p-[4vw] md:pt-3.5 md:pb-2.5 sm:p-[2vw] sm:pt-1.5 sm:pb-1"
          >
            <h2 className="text-orange-500 text-3xl font-extrabold mb-4 border-b-2 border-amber-300 inline-block pb-1 tracking-widest">
              {cat.category}
            </h2>
            <ul className="list-none p-0 m-0 flex flex-col gap-0">
              {cat.items.map((item) => (
                <li
                  key={item._id || item.name}
                  className={`relative flex items-center gap-4 bg-gradient-to-r from-warm-300 to-warm-200 rounded-2xl p-6 mb-3 shadow-[0_2px_10px_rgba(255,152,0,0.07)] transition-all duration-200 hover:shadow-[0_8px_32px_#ff9800cc] hover:scale-103 hover:-translate-y-0.5 hover:z-10 animate-foodCardPop ${item.isAvailable === false ? 'blur-sm grayscale opacity-60 pointer-events-none' : ''} md:flex-col md:items-start md:gap-1.5 md:p-2.5 md:rounded-[10px] sm:p-2 sm:rounded-[8px]`}
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
                      onClick={() => addToCart(item)}
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
            </ul>
          </section>
        ))}
      </div>
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] animate-fadeInModal"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-warm-100 rounded-[18px] p-9 min-w-[280px] max-w-[90vw] shadow-[0_4px_32px_#ff9800cc] text-center animate-popIn 2xl:p-9 xl:p-7 md:p-4.5 sm:p-2.5 sm:min-w-[120px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-orange-600 mb-4 md:text-xl sm:text-lg">
              {selectedItem.name}
            </h2>
            <p className="text-base text-gray-700 mb-4 md:text-sm sm:text-sm">
              {selectedItem.description}
            </p>
            <p className="text-base mb-4 md:text-sm sm:text-sm">
              <strong>Availability:</strong>{' '}
              {selectedItem.isAvailable ? 'Available' : 'Not Available'}
            </p>
            {selectedItem.addons && selectedItem.addons.length > 0 && (
              <div className="text-base mb-4 md:text-sm sm:text-sm">
                <strong>Add-ons:</strong> {selectedItem.addons.join(', ')}
              </div>
            )}
            <button
              className="mt-4 bg-gradient-to-r from-orange-500 to-amber-300 text-white border-none rounded-lg px-5 py-2 text-base font-bold cursor-pointer transition-all duration-200 hover:bg-[#c95d0c] hover:scale-105 md:text-sm sm:text-sm"
              onClick={() => setSelectedItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;