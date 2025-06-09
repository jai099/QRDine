import React from "react";
import styles from "./FeaturedDishes.module.css";

const dishes = [
  {
    id: 1,
    name: "Truffle Mushroom Risotto",
    price: "₹499",
    desc: "Creamy Arborio rice with fresh mushrooms and black truffle oil.",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Grilled Salmon Fillet",
    price: "₹699",
    desc: "Perfectly grilled salmon with lemon butter sauce and veggies.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Classic Margherita Pizza",
    price: "₹349",
    desc: "Stone-baked pizza with fresh mozzarella, tomatoes, and basil.",
    img: "https://media.istockphoto.com/id/1427212489/photo/pizza-hawaiian-cheese-on-wood-table-homemade-food-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=wWTKu4NxVnT9cOBv9_GCseN0zTw2bPiEZRz_6wCdrUg=",
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    price: "₹249",
    desc: "Warm chocolate cake with a gooey molten center served with ice cream.",
    img: "https://media.istockphoto.com/id/2176626131/photo/delicious-chocolate-lava-cake-oozing-on-white-plate-with-ice-cream.webp?a=1&b=1&s=612x612&w=0&k=20&c=XJSw1cxjGuKVdZv7j3WWUCjkVZKoagdvUjONX1Yagt8=",
  },
  {
    id: 5,
    name: "Caesar Salad",
    price: "₹299",
    desc: "Crisp romaine lettuce tossed with Caesar dressing, croutons, and parmesan.",
    img: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Iced Cold Brew Coffee",
    price: "₹199",
    desc: "Rich and smooth cold brew served over ice with a splash of milk.",
    img: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=500&auto=format&fit=crop&q=60",
  },
];

const FeaturedDishes = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-14 tracking-wide">
        Featured Dishes
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {dishes.map(({ id, name, price, desc, img }) => (
          <div key={id} className={`relative h-[400px] ${styles.cardWrapper}`}>
            <div className={`${styles.card3d} relative w-full h-full`}>
              {/* FRONT */}
              <div className={`${styles.front} shadow-lg`}>
                <div className="h-40 flex justify-center items-center p-4">
                  <img
                    src={img}
                    alt={name}
                    className="max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                  <p className="text-orange-600 font-medium text-md">{price}</p>
                  <p className="text-gray-600 text-sm mt-2">{desc}</p>
                </div>
              </div>

              {/* BACK */}
              <div className={`${styles.back}`}>
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedDishes;
