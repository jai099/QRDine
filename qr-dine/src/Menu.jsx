import React from 'react';
import './Menu.css';

const menuData = [
  {
    category: 'Starters',
    items: [
      { name: 'Paneer Tikka', price: 180 },
      { name: 'Veg Spring Roll', price: 150 },
      { name: 'Chicken Pakora', price: 200 },
    ],
  },
  {
    category: 'Main Course',
    items: [
      { name: 'Dal Makhani', price: 220 },
      { name: 'Butter Chicken', price: 320 },
      { name: 'Paneer Butter Masala', price: 250 },
      { name: 'Jeera Rice', price: 120 },
    ],
  },
  {
    category: 'Breads',
    items: [
      { name: 'Butter Naan', price: 40 },
      { name: 'Tandoori Roti', price: 25 },
      { name: 'Lachha Paratha', price: 50 },
    ],
  },
  {
    category: 'Desserts',
    items: [
      { name: 'Gulab Jamun', price: 60 },
      { name: 'Ras Malai', price: 80 },
    ],
  },
  {
    category: 'Beverages',
    items: [
      { name: 'Masala Chai', price: 30 },
      { name: 'Cold Coffee', price: 70 },
      { name: 'Lassi', price: 50 },
    ],
  },
];

const Menu = () => {
  return (
    <div className="menu-container">
      <h1 className="restaurant-title">TARS Bhojnalaya</h1>
      <div className="menu-categories">
        {menuData.map((cat) => (
          <div className="menu-category" key={cat.category}>
            <h2>{cat.category}</h2>
            <ul>
              {cat.items.map((item) => (
                <li key={item.name} className="menu-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
