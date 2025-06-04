import React, { useState, useRef, useEffect } from 'react';
import './Menu.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/menu/available';

const Menu = ({ cart, addToCart, removeFromCart, decreaseQty }) => {
	const [menuData, setMenuData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeCategory, setActiveCategory] = useState('');
	const [selectedItem, setSelectedItem] = useState(null);
	const [search, setSearch] = useState("");
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

	// Filtered menu based on search
	const filteredMenuData = menuData.map(cat => ({
		category: cat.category,
		items: cat.items.filter(item =>
			item.name.toLowerCase().includes(search.toLowerCase()) ||
			(item.description && item.description.toLowerCase().includes(search.toLowerCase()))
		)
	})).filter(cat => cat.items.length > 0);

	if (loading) return <div className="menu-fullpage-container">Loading menu...</div>;
	if (error) return <div className="menu-fullpage-container">Error: {error}</div>;
	if (!menuData.length) return <div className="menu-fullpage-container">No menu items found.</div>;

	return (
		<div className="menu-fullpage-container">
			<header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 32px 0 32px'}}>
				<div style={{fontWeight:900,fontSize:'1.5rem',color:'#333'}}>&#9776; Menu</div>
				<nav style={{display:'flex',gap:'32px'}}>
					{menuData.map((cat) => (
						<a key={cat.category} href="#" className="category-btn" style={{background:activeCategory===cat.category?'linear-gradient(90deg,#ff9800 0%,#ffb74d 100%)':'',color:activeCategory===cat.category?'#fff':'#e65100'}} onClick={() => handleCategoryClick(cat.category)}>{cat.category}</a>
					))}
				</nav>
			</header>

			{/* Banner */}
			<div style={{background:'#fff8f0',borderRadius:'18px',boxShadow:'0 2px 12px #ffe0b2',margin:'32px auto 18px auto',maxWidth:'900px',padding:'24px 32px',display:'flex',alignItems:'center',gap:'32px'}}>
				<img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" alt="banner" style={{width:'120px',height:'120px',borderRadius:'16px',objectFit:'cover',boxShadow:'0 2px 8px #ff9800'}}/>
				<div style={{flex:1}}>
					<div style={{fontWeight:900,fontSize:'1.4rem',color:'#e65100',marginBottom:4}}>QR-Dine <span style={{background:'#ffe0b2',color:'#388e3c',fontWeight:700,borderRadius:6,padding:'2px 8px',fontSize:'0.9rem',marginLeft:8}}>Pure Veg</span></div>
					<div style={{display:'flex',alignItems:'center',gap:'18px',fontSize:'1rem',color:'#888',marginBottom:6}}>
						<span>★ 4.4</span>
						<span>1,500+ ratings</span>
						<span>• 32 mins</span>
						<span>• ₹300 for two</span>
					</div>
					<div style={{color:'#888',fontSize:'0.98rem',marginBottom:8}}>Italian, Pizza, Fast Food</div>
					<div style={{display:'flex',gap:'12px'}}>
						<span style={{background:'#d0ffdb',color:'#388e3c',fontWeight:700,borderRadius:6,padding:'2px 8px',fontSize:'0.9rem'}}>20% OFF up to ₹100</span>
						<span style={{background:'#e3f2fd',color:'#1976d2',fontWeight:700,borderRadius:6,padding:'2px 8px',fontSize:'0.9rem'}}>Free Delivery</span>
					</div>
				</div>
			</div>

			{/* Search and Filter */}
			<div style={{display:'flex',alignItems:'center',gap:'18px',maxWidth:'900px',margin:'0 auto 18px auto'}}>
				<input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for dishes..." style={{flex:1,padding:'12px 18px',borderRadius:'12px',border:'1px solid #ffe0b2',fontSize:'1.08rem',boxShadow:'0 1px 4px #ffe0b2'}}/>
				<button style={{background:'#ff9800',color:'#fff',border:'none',borderRadius:'10px',padding:'10px 22px',fontWeight:700,fontSize:'1rem',boxShadow:'0 2px 8px #ffe0b2',cursor:'pointer'}}>Filter</button>
			</div>

			{/* Featured Section (first category) */}
			{filteredMenuData.length > 0 && (
				<div style={{maxWidth:'900px',margin:'0 auto 32px auto'}}>
					<div style={{fontWeight:900,fontSize:'1.2rem',color:'#e65100',marginBottom:12}}>{filteredMenuData[0].category}</div>
					<div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
						{filteredMenuData[0].items.slice(0,3).map(item => (
							<div key={item._id || item.name} style={{background:'#fff',borderRadius:'16px',boxShadow:'0 2px 10px #ffe0b2',padding:'18px',width:'220px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
								<img src={item.image || 'https://via.placeholder.com/120'} alt={item.name} style={{width:'120px',height:'90px',borderRadius:'12px',objectFit:'cover',marginBottom:8}}/>
								<div style={{fontWeight:700,fontSize:'1.08rem',color:'#222',marginBottom:2}}>{item.name}</div>
								<div style={{color:'#888',fontSize:'0.98rem',marginBottom:6}}>{item.description?.slice(0,32) || ''}</div>
								<div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:6}}>
									<span style={{color:'#43a047',fontWeight:700,fontSize:'1.1rem'}}>₹ {item.price}</span>
									<span style={{color:'#bdbdbd',textDecoration:'line-through',fontSize:'0.98rem'}}>₹{Math.round(item.price*1.15)}</span>
									<span style={{color:'#388e3c',fontWeight:700,fontSize:'0.95rem'}}>{Math.round(100-(item.price/(item.price*1.15))*100)}% OFF</span>
								</div>
								<button className="qty-btn" style={{width:'80%',margin:'0 auto'}} onClick={()=>addToCart(item)} disabled={item.isAvailable===false}>Add</button>
								{item.isAvailable===false && <div className="not-available-overlay">Not available</div>}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Other categories */}
			{filteredMenuData.slice(1).map(cat => (
				<div key={cat.category} style={{maxWidth:'900px',margin:'0 auto 32px auto'}}>
					<div style={{fontWeight:900,fontSize:'1.2rem',color:'#e65100',marginBottom:12}}>{cat.category}</div>
					<div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
						{cat.items.map(item => (
							<div key={item._id || item.name} style={{background:'#fff',borderRadius:'16px',boxShadow:'0 2px 10px #ffe0b2',padding:'18px',width:'220px',display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
								<img src={item.image || 'https://via.placeholder.com/120'} alt={item.name} style={{width:'120px',height:'90px',borderRadius:'12px',objectFit:'cover',marginBottom:8}}/>
								<div style={{fontWeight:700,fontSize:'1.08rem',color:'#222',marginBottom:2}}>{item.name}</div>
								<div style={{color:'#888',fontSize:'0.98rem',marginBottom:6}}>{item.description?.slice(0,32) || ''}</div>
								<div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:6}}>
									<span style={{color:'#43a047',fontWeight:700,fontSize:'1.1rem'}}>₹ {item.price}</span>
									<span style={{color:'#bdbdbd',textDecoration:'line-through',fontSize:'0.98rem'}}>₹{Math.round(item.price*1.15)}</span>
									<span style={{color:'#388e3c',fontWeight:700,fontSize:'0.95rem'}}>{Math.round(100-(item.price/(item.price*1.15))*100)}% OFF</span>
								</div>
								<button className="qty-btn" style={{width:'80%',margin:'0 auto'}} onClick={()=>addToCart(item)} disabled={item.isAvailable===false}>Add</button>
								{item.isAvailable===false && <div className="not-available-overlay">Not available</div>}
							</div>
						))}
					</div>
				</div>
			))}

			{/* Bottom bar (location, search, sign in, cart) */}
			<footer style={{position:'fixed',bottom:0,left:0,width:'100vw',background:'#fff',boxShadow:'0 -2px 12px #ffe0b2',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 32px',zIndex:100}}>
				<div style={{display:'flex',alignItems:'center',gap:'8px'}}>
					<img src="https://img.icons8.com/ios-filled/40/ff9800/marker.png" alt="loc" style={{width:24,height:24}}/>
					<span style={{fontWeight:700,color:'#e65100'}}>Bangalore</span>
				</div>
				<div style={{display:'flex',alignItems:'center',gap:'32px'}}>
					<span style={{color:'#888',fontWeight:500,cursor:'pointer'}}><i className="fa fa-search"/> Search</span>
					<span style={{color:'#888',fontWeight:500,cursor:'pointer'}}><i className="fa fa-user"/> Sign In</span>
					<span style={{color:'#888',fontWeight:500,cursor:'pointer'}}><i className="fa fa-shopping-cart"/> Cart</span>
				</div>
			</footer>
		</div>
	);
};

export default Menu;
