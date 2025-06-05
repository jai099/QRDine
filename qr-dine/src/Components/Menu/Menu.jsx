import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuHeader from './MenuHeader.jsx';
import MenuCategoryNav from './MenuCategoryNav.jsx';
import MenuCategorySection from './MenuCategorySection.jsx';
import MenuItemModal from './MenuItemModal.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

const Menu = ({ cart = [], addToCart = () => {}, removeFromCart = () => {}, decreaseQty = () => {} }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef({});
  const location = useLocation();

  // Get table number from URL query param (?table=1)
  const tableNumber = (() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('table');
    return t ? parseInt(t, 10) : null;
  })();

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch menu');
        return res.json();
      })
      .then(data => {
        const grouped = data.reduce((acc, item) => {
          const cat = item.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {});
        const menuArr = Object.keys(grouped).map(category => ({
          category,
          items: grouped[category]
        }));
        setMenuData(menuArr);
        setActiveCategory(menuArr[0]?.category || '');
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = category => {
    setActiveCategory(category);
    setTimeout(() => {
      sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offsets = menuData.map(cat => {
        const ref = sectionRefs.current[cat.category];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          return { category: cat.category, top: rect.top };
        }
        return null;
      }).filter(Boolean);

      const threshold = 60;
      const visible = offsets.filter(o => o.top <= threshold);
      if (visible.length > 0) {
        setActiveCategory(visible[visible.length - 1].category);
      }

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = (scrollTop / docHeight) * 100;
      setScrollProgress(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuData]);

  const getQty = item => {
    const found = cart.find(i => i.name === item.name);
    return found ? found.qty : 0;
  };

  const handleAdd = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemove = (item) => {
    decreaseQty(item);
    toast.warn(`${item.name} removed from cart!`);
  };

  if (loading) return <div className="w-screen min-h-screen font-sans">Loading menu...</div>;
  if (error) return <div className="w-screen min-h-screen font-sans">Error: {error}</div>;
  if (!menuData.length) return <div className="w-screen min-h-screen font-sans">No menu items found.</div>;

  return (
    <div className="w-screen min-h-screen font-sans bg-gradient-to-r from-warm-300 to-warm-200 pb-10 animate-fadeInBg">
      {/* Toasts */}
      <ToastContainer position="bottom-right" autoClose={2500} theme="colored" />

      {/* Progress Bar */}
      <div className="sticky top-0 z-50 h-[5px] bg-orange-200">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Header */}
      <MenuHeader />

      {/* Category Nav */}
      <MenuCategoryNav menuData={menuData} activeCategory={activeCategory} handleCategoryClick={handleCategoryClick} />

      {/* Menu Sections */}
      <div className="max-w-[1100px] mx-auto flex flex-col gap-0 px-[2vw] 2xl:max-w-[900px] xl:max-w-[98vw] md:max-w-full sm:max-w-full sm:px-[1vw]">
        {menuData.map(cat => (
          <MenuCategorySection
            key={cat.category}
            cat={cat}
            sectionRefs={sectionRefs}
            getQty={getQty}
<<<<<<< HEAD
            decreaseQty={handleRemove}
            addToCart={handleAdd}
=======
            decreaseQty={decreaseQty}
            addToCart={addToCart}
            tableNumber={tableNumber}
>>>>>>> 1cbc44bc4140921b1f31a67ec7418fa07a967c1b
          />
        ))}
      </div>

      {/* Modal */}
      <MenuItemModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default Menu;
