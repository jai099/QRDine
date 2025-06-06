import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import Image1 from '../../assets/Menu/logoimage.jpg';
import VegImg from '../../assets/Veg and Non Veg/Veg.jpg';
import NonVegImg from '../../assets/Veg and Non Veg/Non Veg.jpg';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

// Debounce utility for search input
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Menu = ({ cart = [], addToCart = () => { }, removeFromCart = () => { }, decreaseQty = () => { } }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userCity, setUserCity] = useState('Fetching...');
  const [locationReady, setLocationReady] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const sectionRefs = useRef({});
  const location = useLocation();

  // Extract table number from URL
  const tableNumber = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('table');
    return t ? parseInt(t, 10) : null;
  }, [location.search]);

  // Only show cart items for this table
  const filteredCart = useMemo(() => {
    if (!tableNumber) return cart;
    return cart.filter(item => item.tableNumber === tableNumber);
  }, [cart, tableNumber]);

  // Geolocation effect to detect user city
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserCity('Unknown');
      setLocationReady(true);
      setLocationError('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state ||
            'Unknown';
          setUserCity(city);
        } catch {
          setUserCity('Unknown');
        }
        setLocationReady(true);
      },
      (err) => {
        setUserCity('Unknown');
        setLocationReady(true);
        setLocationError('Location permission denied. Please allow location access to use this service.');
      }
    );
  }, []);

  // Only fetch menu after location is ready
  useEffect(() => {
    if (!locationReady) return;
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();

        // Group items by category
        const grouped = data.reduce((acc, item) => {
          const cat = item.category || 'Other';
          acc[cat] = acc[cat] || [];
          acc[cat].push(item);
          return acc;
        }, {});

        // Create menu array with Featured section
        const menuArr = [];
        const featured = data.filter((item) => item.isFeatured);
        if (featured.length) menuArr.push({ category: 'Featured', items: featured });
        Object.keys(grouped).forEach((category) => {
          menuArr.push({ category, items: grouped[category] });
        });

        setMenuData(menuArr);
        setActiveCategory(menuArr[0]?.category || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [locationReady]);

  // Handle scroll for category highlighting and progress bar
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
      const visible = offsets.find((o) => o.top <= threshold && o.top >= -threshold);
      if (visible) setActiveCategory(visible.category);
      else if (menuData.length > 0) setActiveCategory(menuData[0].category);

      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      setScrollProgress((scrollTop / totalHeight) * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuData]);

  // Debounced search handler
  const debouncedSearch = debounce((value) => setSearchTerm(value), 300);

  // Filter menu data
  const filteredMenuData = useMemo(() => {
    return menuData
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const matchesSearch =
            !searchTerm.trim() ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.desc && item.desc.toLowerCase().includes(searchTerm.toLowerCase()));

          const isVeg = item.isVeg || item.veg === true || item.type === 'veg';
          const isNonVeg = !item.isVeg || item.veg === false || item.type === 'non-veg';
          const matchesVeg = !filterVeg || isVeg;
          const matchesNonVeg = !filterNonVeg || isNonVeg;
          const matchesCategory = !filterCategory || item.category === filterCategory;

          let matchesPrice = true;
          if (filterPrice === '<200') matchesPrice = item.price < 200;
          else if (filterPrice === '200-400') matchesPrice = item.price >= 200 && item.price <= 400;
          else if (filterPrice === '>400') matchesPrice = item.price > 400;

          return matchesSearch && matchesVeg && matchesNonVeg && matchesCategory && matchesPrice;
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [menuData, searchTerm, filterVeg, filterNonVeg, filterCategory, filterPrice]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setTimeout(() => {
      sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleAddToCart = (item) => {
    addToCart(item, tableNumber);
    toast.success(`${item.name} added to cart`, {
      position: 'bottom-center',
      autoClose: 2000,
    });
  };

  if (loading) return <div className="w-screen min-h-screen font-sans">Loading menu...</div>;
  if (error) return <div className="w-screen min-h-screen font-sans">Error: {error}</div>;
  if (!menuData.length) return <div className="w-screen min-h-screen font-sans">No menu items found.</div>;
  if (!locationReady) {
    return <div className="w-screen min-h-screen flex items-center justify-center font-sans text-orange-700 text-xl">Requesting your location... Please allow location access to continue.</div>;
  }
  if (locationError) {
    return <div className="w-screen min-h-screen flex items-center justify-center font-sans text-red-700 text-xl">{locationError}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      {/* Table number visual confirmation */}
      {tableNumber && (
        <div className="w-full bg-orange-100 text-orange-700 text-center py-2 font-bold text-lg shadow-sm">
          You are ordering for <span className="text-orange-600">Table #{tableNumber}</span>
        </div>
      )}

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-orange-500 z-50 transition-all duration-200 ease-in-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Restaurant Banner */}
      <div className="bg-[#fff8ee] rounded-xl shadow-md mx-2 sm:mx-4 mt-4 p-3 sm:p-6 flex flex-col gap-2 sm:gap-4">
        <div className="flex gap-2 sm:gap-4 items-center flex-col sm:flex-row">
          <img
            src={Image1}
            alt="banner"
            className="rounded-xl w-24 h-24 sm:w-32 sm:h-32 object-cover border-2 border-orange-200"
          />
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
              <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded">20% OFF up to ₹100</span>
            </div>
          </div>
        </div>
      </div>

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
              className={`hover:text-orange-500 transition ${activeCategory === cat.category ? 'text-orange-500' : ''
                }`}
              onClick={() => handleCategoryClick(cat.category)}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </nav>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mx-2 sm:mx-4 mt-4 sm:mt-6">
        <input
          type="text"
          placeholder="Search for dishes..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm sm:text-base w-full"
        />
        <button
          className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-lg font-bold shadow hover:bg-orange-600 transition flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
          onClick={() => setShowFilter(true)}
        >
          <span className="material-icons">Filter</span>
        </button>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setShowFilter(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs sm:max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-orange-600">Filter Menu</h3>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Type</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={filterVeg}
                    onChange={(e) => setFilterVeg(e.target.checked)}
                  />
                  Veg
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={filterNonVeg}
                    onChange={(e) => setFilterNonVeg(e.target.checked)}
                  />
                  Non-Veg
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Category</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All</option>
                {menuData.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Price</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={filterPrice}
                onChange={(e) => setFilterPrice(e.target.value)}
              >
                <option value="">All</option>
                <option value="<200">Below ₹200</option>
                <option value="200-400">₹200 - ₹400</option>
                <option value=">400">Above ₹400</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-orange-500 text-white py-2 rounded font-bold hover:bg-orange-600 transition"
                onClick={() => setShowFilter(false)}
              >
                Apply
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold hover:bg-gray-300 transition"
                onClick={() => {
                  setFilterVeg(false);
                  setFilterNonVeg(false);
                  setFilterCategory('');
                  setFilterPrice('');
                  setShowFilter(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Sections */}
      <div className="w-full px-1 sm:px-4 flex-1">
        {filteredMenuData.length === 0 && (
          <div className="text-center text-gray-500 mt-8">No items found for "{searchTerm}"</div>
        )}
        {filteredMenuData.map((section) => (
          <div
            key={section.category}
            ref={(el) => (sectionRefs.current[section.category] = el)}
            className="w-full mt-6"
          >
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 mb-3 sm:mb-4 pl-1 ">{section.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {section.items.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="bg-white shadow-md flex flex-col items-center w-full rounded-lg">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-l-lg rounded-lg rounded-b-none"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {item.isVeg || item.veg === true || item.type === 'veg' ? (
                      <img src={VegImg} alt="Veg" className="w-6 h-6" title="Veg" />
                    ) : null}
                    {item.isVeg === false || item.veg === false || item.type === 'non-veg' ? (
                      <img src={NonVegImg} alt="Non-Veg" className="w-6 h-6" title="Non-Veg" />
                    ) : null}
                  </div>
                  <div className='flex flex-col items-center w-full p-2'>
  <div className="flex items-center gap-2 w-full mb-1">
    {item.isVeg || item.veg === true || item.type === 'veg' ? (
      <img src={VegImg} alt="Veg" className="w-5 h-5 rounded-full shadow border border-green-400" title="Veg" />
    ) : null}
    {item.isVeg === false || item.veg === false || item.type === 'non-veg' ? (
      <img src={NonVegImg} alt="Non-Veg" className="w-5 h-5 rounded-full shadow border border-red-400" title="Non-Veg" />
    ) : null}
    <span className="font-bold text-base sm:text-md text-gray-800 text-left line-clamp-2">{item.name}</span>
  </div>
  <div className="text-gray-500 text-xs sm:text-sm mb-1 text-left w-full line-clamp-2">{item.description}</div>
</div>
                  <div className="flex justify-around items-center w-full h-full px-3 py-2">
                    <div className="flex flex-none items-center justify-center mb-2">
                      <span className="text-orange-600 font-bold text-base sm:text-lg">₹{item.price}</span>
                      {item.oldPrice && <span className="line-through text-gray-400 text-xs sm:text-sm">₹{item.oldPrice}</span>}
                      {item.discount && <span className="text-green-600 text-xs font-bold">{item.discount}</span>}
                    </div>
                    <button
                      className="bg-orange-500 text-white rounded-lg font-bold shadow hover:bg-orange-600 transition mt-1 w-[5em] h-[2.5em]"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Popup */}
      {filteredCart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg z-50 transition-all hover:bg-orange-600 cursor-pointer">
          {filteredCart.length} item{filteredCart.length > 1 ? 's' : ''} in cart
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 mb-2 sm:mb-4 flex flex-col sm:flex-row justify-between items-center px-2 sm:px-8 text-gray-500 text-xs sm:text-sm gap-2 sm:gap-0 w-full">
        <div className="flex items-center gap-2">
          <span className='font-semibold text-2xl'>📍 {userCity}</span>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

Menu.propTypes = {
  cart: PropTypes.array,
  addToCart: PropTypes.func,
  removeFromCart: PropTypes.func,
  decreaseQty: PropTypes.func,
};

export default Menu;