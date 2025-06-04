      import React, { useState } from "react";
      
      // Example menuData, replace with your actual data or import
      const menuData = [
        { category: "Starters" },
        { category: "Main Course" },
        { category: "Desserts" }
      ];
      
      const Menucard = () => {
        const [activeCategory, setActiveCategory] = useState(menuData[0].category);
      
        const handleCategoryClick = (category) => {
          setActiveCategory(category);
        };
      
        return (
          <div className="sticky top-0 flex justify-center gap-4 mb-7 bg-white py-4 px-0 z-20 rounded-b-3xl shadow-[0_2px_8px_rgba(255,152,0,0.07)] animate-slideDown">
            {menuData.map((cat) => (
              <button
                key={cat.category}
                className={`bg-gradient-to-r from-warm-300 to-amber-300 text-orange-600 font-bold text-base py-3 px-7 rounded-[20px] shadow-[0_2px_8px_#ffe0b2] transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-300 hover:text-white hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_#ff9800cc] ${activeCategory === cat.category ? 'bg-gradient-to-r from-orange-500 to-amber-300 text-white scale-105 -translate-y-0.5 shadow-[0_4px_16px_#ff9800cc]' : ''}`}
                onClick={() => handleCategoryClick(cat.category)}
              >
                {cat.category}
              </button>
            ))}
          </div>
        );
      };
      
      export default Menucard;