import React, { useState, useRef, useEffect } from 'react';
import './Menu.css';

const menuData = [
	{
		category: 'Starters',
		items: [
			{
				name: 'Paneer Tikka',
				price: 180,
				available: true,
				description: 'Grilled paneer cubes marinated in spices.',
				addons: ['Extra Cheese', 'Spicy Sauce'],
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Veg Spring Roll',
				price: 150,
				available: false,
				description: 'Crispy rolls stuffed with fresh veggies.',
				addons: ['Sweet Chili Sauce'],
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Chicken Pakora',
				price: 200,
				available: true,
				description: 'Deep-fried chicken fritters.',
				addons: ['Mint Chutney'],
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
				available: true,
				description: 'Creamy black lentils simmered with spices.',
				addons: ['Butter', 'Extra Spices'],
				image:
					'https://images.unsplash.com/photo-1516685018646-5499d0a7d42f?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Butter Chicken',
				price: 320,
				available: true,
				description: 'Chicken in a creamy tomato sauce.',
				addons: ['Garlic Naan', 'Rice'],
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Paneer Butter Masala',
				price: 250,
				available: true,
				description: 'Paneer in a rich and creamy butter sauce.',
				addons: ['Jeera Rice', 'Naan'],
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Jeera Rice',
				price: 120,
				available: true,
				description: 'Rice cooked with cumin seeds.',
				addons: ['Raita', 'Salad'],
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
				available: true,
				description: 'Soft Indian bread topped with butter.',
				addons: ['Garlic', 'Herbs'],
				image:
					'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Tandoori Roti',
				price: 25,
				available: true,
				description: 'Whole wheat bread cooked in a tandoor.',
				addons: ['Butter', 'Pickle'],
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Lachha Paratha',
				price: 50,
				available: true,
				description: 'Layered flatbread cooked in a tandoor.',
				addons: ['Butter', 'Yogurt'],
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
				available: true,
				description: 'Deep-fried dough balls in sugar syrup.',
				addons: ['Vanilla Ice Cream'],
				image:
					'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Ras Malai',
				price: 80,
				available: true,
				description: 'Cottage cheese in sweetened milk.',
				addons: ['Pistachios', 'Almonds'],
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
				available: true,
				description: 'Spiced tea with milk.',
				addons: ['Lemon', 'Ginger'],
				image:
					'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Cold Coffee',
				price: 70,
				available: true,
				description: 'Iced coffee with milk and sugar.',
				addons: ['Whipped Cream', 'Chocolate Syrup'],
				image:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
			},
			{
				name: 'Lassi',
				price: 50,
				available: true,
				description: 'Yogurt-based drink, sweet or salty.',
				addons: ['Fruit Flavors', 'Mint'],
				image:
					'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
			},
		],
	},
];

const Menu = ({ cart, addToCart, removeFromCart, decreaseQty }) => {
	const [activeCategory, setActiveCategory] = useState('Main Course');
	const [selectedItem, setSelectedItem] = useState(null);
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

			// Only highlight a category if its section top is at least 60px from the top
			const threshold = 60;
			const visible = offsets.filter((o) => o.top <= threshold);
			if (visible.length > 0) {
				setActiveCategory(visible[visible.length - 1].category);
			} else {
				setActiveCategory(menuData[0].category);
			}
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const getQty = (item) => {
		const found = cart.find((i) => i.name === item.name);
		return found ? found.qty : 0;
	};

	return (
		<div className="menu-fullpage-container">
			<h1 className="restaurant-title">HOTEL TARS MAHAL</h1>
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
											disabled={getQty(item) === 0 || !item.available}
										>
											-
										</button>
										<span className="qty-value">{getQty(item)}</span>
										<button
											className="qty-btn"
											onClick={() => addToCart(item)}
											disabled={!item.available}
										>
											+
										</button>
									</div>
									{!item.available && (
										<div className="not-available-overlay">Not available</div>
									)}
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
			{selectedItem && (
				<div className="item-modal" onClick={() => setSelectedItem(null)}>
					<div className="item-modal-content" onClick={(e) => e.stopPropagation()}>
						<h2>{selectedItem.name}</h2>
						<p>{selectedItem.description}</p>
						<p>
							<strong>Availability:</strong>{' '}
							{selectedItem.available ? 'Available' : 'Not Available'}
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
