import React, { useState, useRef, useEffect } from 'react';
import MenuHeader from './MenuHeader.jsx';
import MenuCategoryNav from './MenuCategoryNav.jsx';
import MenuCategorySection from './MenuCategorySection.jsx';
import MenuItemModal from './MenuItemModal.jsx';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

const Menu = (props) => {
  const { cart = [], addToCart = () => {}, removeFromCart = () => {}, decreaseQty = () => {} } = props;
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
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

  const getQty = (item) => {
    const found = cart.find((i) => i.name === item.name);
    return found ? found.qty : 0;
  };

  if (loading) return <div className="w-screen min-h-screen font-sans">Loading menu...</div>;
  if (error) return <div className="w-screen min-h-screen font-sans">Error: {error}</div>;
  if (!menuData.length) return <div className="w-screen min-h-screen font-sans">No menu items found.</div>;

  return (
    <div className="w-screen min-h-screen font-sans bg-gradient-to-r from-warm-300 to-warm-200 pb-10 animate-fadeInBg">
      <MenuHeader />
      <MenuCategoryNav menuData={menuData} activeCategory={activeCategory} handleCategoryClick={handleCategoryClick} />
      <div className="max-w-[1100px] mx-auto flex flex-col gap-0 px-[2vw] 2xl:max-w-[900px] xl:max-w-[98vw] md:max-w-full sm:max-w-full sm:px-[1vw]">
        {menuData.map((cat) => (
          <MenuCategorySection
            key={cat.category}
            cat={cat}
            sectionRefs={sectionRefs}
            getQty={getQty}
            decreaseQty={decreaseQty}
            addToCart={addToCart}
          />
        ))}
      </div>
      <MenuItemModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default Menu;