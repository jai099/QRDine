import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

const Menu = (props) => {
  const { cart = [], addToCart = () => {}, removeFromCart = () => {}, decreaseQty = () => {} } = props;
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRefs = useRef({});
  const location = useLocation();

  // Get table number from URL query param (?table=1)
  const tableNumber = (() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('table');
    return t ? parseInt(t, 10) : null;
  })();

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
        // Featured section: items with isFeatured flag
        const featured = data.filter((item) => item.isFeatured);
        const menuArr = [];
        if (featured.length) menuArr.push({ category: 'Featured', items: featured });
        Object.keys(grouped).forEach((category) => {
          menuArr.push({ category, items: grouped[category] });
        });
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

  const getQty = (item) => {
    const found = cart.find((i) => i.name === item.name);
    return found ? found.qty : 0;
  };

  // Filtered menu data based on search
  const filteredMenuData = searchTerm.trim()
    ? menuData
        .map((section) => ({
            ...section,
            items: section.items.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.desc && item.desc.toLowerCase().includes(searchTerm.toLowerCase()))
            ),
        }))
        .filter((section) => section.items.length > 0)
    : menuData;

  if (loading) return <div className="w-screen min-h-screen font-sans">Loading menu...</div>;
  if (error) return <div className="w-screen min-h-screen font-sans">Error: {error}</div>;
  if (!menuData.length) return <div className="w-screen min-h-screen font-sans">No menu items found.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Top NavBar */}
      <nav className="bg-white shadow-md rounded-xl mx-2 sm:mx-4 mt-2 sm:mt-4 flex flex-col sm:flex-row items-center px-2 sm:px-6 py-2 sm:py-3 justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mb-2 sm:mb-0">
          <button className="text-xl sm:text-2xl text-orange-500 font-bold mr-2">
            <span className="material-icons">menu</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-6 text-sm sm:text-base font-semibold text-gray-700 w-full sm:w-auto justify-center">
          {menuData.map((cat) => (
            <button
              key={cat.category}
              className={hover:text-orange-500 transition ${activeCategory === cat.category ? 'text-orange-500' : ''}}
              onClick={() => handleCategoryClick(cat.category)}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </nav>

      {/* Restaurant Banner */}
      <div className="bg-[#fff8ee] rounded-xl shadow-md mx-2 sm:mx-4 mt-4 p-3 sm:p-6 flex flex-col gap-2 sm:gap-4">
        <div className="flex gap-2 sm:gap-4 items-center flex-col sm:flex-row">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=120&q=80" alt="banner" className="rounded-xl w-24 h-24 sm:w-32 sm:h-32 object-cover border-2 border-orange-200" />
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-lg sm:text-2xl font-bold text-orange-700">Hotel TARS Mahal</span>
              <span className="bg-orange-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded">Pure Veg</span>
              <span className="bg-orange-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">Non-Veg</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-gray-600 text-xs sm:text-sm mb-2">
              <span>★ 4.4</span>
              <span>1,500+ ratings</span>
            </div>
            <div className="text-gray-500 text-xs sm:text-sm mb-2">Italian, Pizza, Fast Food, Main Course</div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">20% OFF up to ₹100</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">Free Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mx-2 sm:mx-4 mt-4 sm:mt-6">
        <input
          type="text"
          placeholder="Search for dishes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm sm:text-base w-full"
        />
        <button className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-lg font-bold shadow hover:bg-orange-600 transition flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <span className="material-icons">filter</span>
        </button>
      </div>

      {/* Dynamic Menu Sections */}
      <div className="w-full px-1 sm:px-4">
        {filteredMenuData.length === 0 && (
          <div className="text-center text-gray-500 mt-8">No items found for "{searchTerm}"</div>
        )}
        {filteredMenuData.map((section) => (
          <div
            key={section.category}
            ref={(el) => (sectionRefs.current[section.category] = el)}
            className="w-full mt-6"
          >
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-3 sm:mb-4 pl-1">{section.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {section.items.map((item, idx) => (
                <div key={item._id || idx} className="bg-white rounded-xl shadow-md p-2 sm:p-4 flex flex-col items-center w-full">
                  <img src={item.img || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=120&q=80'} alt={item.name} className="rounded-lg w-20 h-16 sm:w-32 sm:h-24 object-cover mb-2" />
                  <div className="font-bold text-base sm:text-lg text-gray-800 text-center w-full line-clamp-2">{item.name}</div>
                  <div className="text-gray-500 text-xs sm:text-sm mb-1 text-center w-full line-clamp-2">{item.desc}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-600 font-bold text-base sm:text-lg">₹{item.price}</span>
                    {item.oldPrice && (
                      <span className="line-through text-gray-400 text-xs sm:text-sm">₹{item.oldPrice}</span>
                    )}
                    {item.discount && (
                      <span className="text-green-600 text-xs font-bold">{item.discount}</span>
                    )}
                  </div>
                  <button
                    className="bg-orange-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold shadow hover:bg-orange-600 transition w-full mt-1"
                    onClick={() => addToCart(item, tableNumber)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer (optional) */}
      <footer className="mt-8 sm:mt-12 mb-2 sm:mb-4 flex flex-col sm:flex-row justify-between items-center px-2 sm:px-8 text-gray-500 text-xs sm:text-sm gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="location" className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>🍊 Nagpur</span>
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <button className="flex items-center gap-1 hover:text-orange-500"><span className="material-icons">search</span> <span className="hidden sm:inline">Search</span></button>
          <button className="flex items-center gap-1 hover:text-orange-500"><span className="material-icons">person</span> <span className="hidden sm:inline">Sign In</span></button>
          <button className="flex items-center gap-1 hover:text-orange-500"><span className="material-icons">shopping_cart</span> <span className="hidden sm:inline">Cart</span></button>
        </div>
      </footer>
    </div>
  );
};

export default Menu;