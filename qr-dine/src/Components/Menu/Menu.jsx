import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

const Menu = (props) => {
  const { cart = [], addToCart = () => {}, removeFromCart = () => {}, decreaseQty = () => {} } = props;
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef({});
  const location = useLocation();

  const tableNumber = (() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('table');
    return t ? parseInt(t, 10) : null;
  })();

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

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setTimeout(() => {
      sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

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

      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const percent = (scrollTop / totalHeight) * 100;
      setScrollProgress(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuData]);

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

  const showToast = (msg, type = 'success') => {
    toast[type](msg, {
      position: 'bottom-center',
      autoClose: 2000,
    });
  };

  const handleAddToCart = (item) => {
    addToCart(item, tableNumber);
    showToast(`${item.name} added to cart`);
  };

  if (loading) return <div className="w-screen min-h-screen font-sans">Loading menu...</div>;
  if (error) return <div className="w-screen min-h-screen font-sans">Error: {error}</div>;
  if (!menuData.length) return <div className="w-screen min-h-screen font-sans">No menu items found.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Sticky Scroll Progress */}
      <div className="fixed top-0 left-0 h-1 bg-orange-500 z-50 transition-all duration-200 ease-in-out" style={{ width: `${scrollProgress}%` }} />

      {/* Top NavBar */}
      <nav className="bg-white shadow-md rounded-xl mx-2 sm:mx-4 mt-2 sm:mt-4 flex flex-col sm:flex-row items-center px-2 sm:px-6 py-2 sm:py-3 justify-between sticky top-1 z-30">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mb-2 sm:mb-0">
          <button className="text-xl sm:text-2xl text-orange-500 font-bold mr-2">
            <span className="material-icons">menu</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-6 text-sm sm:text-base font-semibold text-gray-700 w-full sm:w-auto justify-center">
          {menuData.map((cat) => (
            <button
              key={cat.category}
              className={`hover:text-orange-500 transition ${
                activeCategory === cat.category ? 'text-orange-500' : 'text-gray-700'
              }`}
              onClick={() => handleCategoryClick(cat.category)}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </nav>

      {/* Toasts */}
      <ToastContainer />

      {/* Banner */}
      {/* ... (keep your existing banner code) */}

      {/* Search */}
      {/* ... (keep your existing search bar code) */}

      {/* Menu Sections */}
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
                    {item.oldPrice && <span className="line-through text-gray-400 text-xs sm:text-sm">₹{item.oldPrice}</span>}
                    {item.discount && <span className="text-green-600 text-xs font-bold">{item.discount}</span>}
                  </div>
                  <button
                    className="bg-orange-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold shadow hover:bg-orange-600 transition w-full mt-1"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Smooth Floating Cart Popup */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg z-50 transition-all hover:bg-orange-600 cursor-pointer">
          {cart.length} item{cart.length > 1 ? 's' : ''} in cart
        </div>
      )}

      {/* Footer */}
      {/* ... (keep your existing footer code) */}
    </div>
  );
};

export default Menu;
