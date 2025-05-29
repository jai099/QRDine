import React, { useState, useRef, useEffect } from 'react';
import './Menu.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

const Menu = ({ cart, addToCart, removeFromCart, decreaseQty }) => {
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
				// Group items by category
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
			// Show when user is within 300px of bottom
			setShowBottomNav(scrollY + windowHeight >= docHeight - 300);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [menuData]);

	const getQty = (item) => {
		const found = cart.find((i) => i.name === item.name);
		return found ? found.qty : 0;
	};

	if (loading) return <div className="menu-fullpage-container">Loading menu...</div>;
	if (error) return <div className="menu-fullpage-container">Error: {error}</div>;
	if (!menuData.length) return <div className="menu-fullpage-container">No menu items found.</div>;

	return (
		<div className="menu-fullpage-container">
			<h1 className="restaurant-title">HOTEL TARS MAHAL</h1>
			<div className="menu-categories-top sticky">
				{menuData.map((cat) => (
					<button
						key={cat.category}
						className={`category-btn${activeCategory === cat.category ? ' active' : ''}`}
						onClick={() => handleCategoryClick(cat.category)}
					>
						{cat.category}
					</button>
				))}
			</div>
			<div className="menu-sections-list">
				{menuData.map((cat) => (
					<section
						key={cat.category}
						ref={(el) => (sectionRefs.current[cat.category] = el)}
						className="menu-category-section transparent-bg"
					>
						<ul className="menu-items-list">
							{cat.items.map((item) => (
								<li key={item._id || item.name} className="menu-item-row">
									<div className="item-info">
										<span className="item-name">{item.name}</span>
										<span className="item-price">₹{item.price}</span>
									</div>
									<div className="qty-controls">
										<button
											className="qty-btn"
											onClick={() => decreaseQty(item)}
											disabled={getQty(item) === 0 || item.isAvailable === false}
										>
											-
										</button>
										<span className="qty-value">{getQty(item)}</span>
										<button
											className="qty-btn"
											onClick={() => addToCart(item)}
											disabled={item.isAvailable === false}
										>
											+
										</button>
									</div>
									{item.isAvailable === false && (
										<div className="not-available-overlay">Not available</div>
									)}
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
			{/* Bottom sticky nav for categories */}
			<div className={`menu-categories-bottom${showBottomNav ? '' : ' hide'}`}
				style={{ pointerEvents: showBottomNav ? 'auto' : 'none' }}>
				{menuData.map((cat) => (
					<button
						key={cat.category}
						className={`category-btn${activeCategory === cat.category ? ' active' : ''}`}
						onClick={() => handleCategoryClick(cat.category)}
					>
						{cat.category}
					</button>
				))}
			</div>
			{selectedItem && (
				<div className="item-modal" onClick={() => setSelectedItem(null)}>
					<div className="item-modal-content" onClick={(e) => e.stopPropagation()}>
						<h2>{selectedItem.name}</h2>
						<p>{selectedItem.description}</p>
						<p>
							<strong>Availability:</strong>{' '}
							{selectedItem.isAvailable ? 'Available' : 'Not Available'}
						</p>
						{selectedItem.addons && selectedItem.addons.length > 0 && (
							<div>
								<strong>Add-ons:</strong> {selectedItem.addons.join(', ')}
							</div>
						)}
						<button onClick={() => setSelectedItem(null)} className="close-modal-btn">
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Menu;
