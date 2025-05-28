import React, { useState, useRef, useEffect } from 'react';
import './Menu.css';

const menuData = [
	{
		category: 'Starters',
		items: [
			{
				name: 'Paneer Tikka',
				price: 180,
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Veg Spring Roll',
				price: 150,
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Chicken Pakora',
				price: 200,
				image:
					'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
			},
		],
	},
	{
		category: 'Main Course',
		items: [
			{
				name: 'Dal Makhani',
				price: 220,
				image:
					'https://images.unsplash.com/photo-1516685018646-5499d0a7d42f?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Butter Chicken',
				price: 320,
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Paneer Butter Masala',
				price: 250,
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Jeera Rice',
				price: 120,
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
		],
	},
	{
		category: 'Breads',
		items: [
			{
				name: 'Butter Naan',
				price: 40,
				image:
					'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Tandoori Roti',
				price: 25,
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Lachha Paratha',
				price: 50,
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
		],
	},
	{
		category: 'Desserts',
		items: [
			{
				name: 'Gulab Jamun',
				price: 60,
				image:
					'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Ras Malai',
				price: 80,
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
		],
	},
	{
		category: 'Beverages',
		items: [
			{
				name: 'Masala Chai',
				price: 30,
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Cold Coffee',
				price: 70,
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Lassi',
				price: 50,
				image:
					'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
			},
		],
	},
];

const Menu = () => {
	const [cart, setCart] = useState([]);
	const [activeCategory, setActiveCategory] = useState('Main Course');
	const sectionRefs = useRef({});

	// Scroll to section when category is clicked
	const handleCategoryClick = (category) => {
		setActiveCategory(category);
		sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
			const visible = offsets.filter((o) => o.top <= 120);
			if (visible.length > 0) {
				setActiveCategory(visible[visible.length - 1].category);
			}
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const addToCart = (item) => {
		setCart((prev) => {
			const found = prev.find((i) => i.name === item.name);
			if (found) {
				return prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i));
			} else {
				return [...prev, { ...item, qty: 1 }];
			}
		});
	};

	const removeFromCart = (item) => {
		setCart((prev) => prev.filter((i) => i.name !== item.name));
	};

	const decreaseQty = (item) => {
		setCart((prev) => {
			return prev
				.map((i) => (i.name === item.name ? { ...i, qty: i.qty - 1 } : i))
				.filter((i) => i.qty > 0);
		});
	};

	const getQty = (item) => {
		const found = cart.find((i) => i.name === item.name);
		return found ? found.qty : 0;
	};

	return (
		<div className="menu-fullpage-container">
			<h1 className="restaurant-title">TARS Bhojnalaya</h1>
			<div className="menu-categories-top sticky">
				{menuData.map((cat) => (
					<button
						key={cat.category}
						className={`category-btn${
							activeCategory === cat.category ? ' active' : ''
						}`}
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
								<li key={item.name} className="menu-item-row">
									<div className="item-info">
										<span className="item-name">{item.name}</span>
										<span className="item-price">₹{item.price}</span>
									</div>
									<div className="qty-controls">
										<button
											className="qty-btn"
											onClick={() => decreaseQty(item)}
											disabled={getQty(item) === 0}
										>
											-
										</button>
										<span className="qty-value">{getQty(item)}</span>
										<button className="qty-btn" onClick={() => addToCart(item)}>
											+
										</button>
									</div>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</div>
	);
};

export default Menu;
