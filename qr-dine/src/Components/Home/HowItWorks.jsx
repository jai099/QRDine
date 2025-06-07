// components/HowItWorksTimeline.jsx
import { useState, useEffect } from "react";

const steps = [
  { icon: "📷", title: "Scan QR Code", desc: "Scan the QR code on your table to begin your order." },
  { icon: "📖", title: "Browse Menu", desc: "Explore our delicious offerings with detailed descriptions." },
  { icon: "🛎️", title: "Place Order", desc: "Send your order directly to the kitchen with ease." },
  { icon: "🍽️", title: "Enjoy Meal", desc: "Sit back and enjoy your meal served hot to your table." }
];

export default function HowItWorksTimeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-tr from-[#ffe7d1] via-[#fbbf93] to-[#f68f5f] py-24 px-6 text-[#4a2c2c]">
      <h2 className="text-center text-4xl font-bold mb-14">How It Works</h2>
      <div className="relative overflow-hidden max-w-5xl mx-auto">
        <div
          className="flex transition-transform duration-800"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {steps.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 p-4"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col items-center text-center cursor-pointer">
                <div className="text-7xl mb-5">{icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-700">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Dots nav */}
        <div className="flex justify-center mt-8 space-x-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-4 h-4 rounded-full transition-colors ${active === i ? "bg-[#f68f5f]" : "bg-[#e0b89d]"}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
