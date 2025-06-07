import { motion } from "framer-motion";

const steps = [
  {
    icon: "📷",
    title: "Scan QR Code",
    desc: "Scan the QR code placed at your table to access the menu.",
  },
  {
    icon: "📖",
    title: "Browse Menu",
    desc: "Explore our wide variety of dishes and beverages.",
  },
  {
    icon: "🛎️",
    title: "Place Order",
    desc: "Order directly from your phone, no waiting needed.",
  },
  {
    icon: "🍽️",
    title: "Enjoy Your Meal",
    desc: "Relax and enjoy your meal, we'll take care of the rest.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-yellow-50 py-24 px-4 overflow-hidden">
      <h2 className="text-4xl font-bold text-center text-yellow-900 mb-20">
        How It Works
      </h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Curved vertical timeline */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-2 bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-400 rounded-full z-0"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`relative z-10 flex flex-col md:flex-row items-center mb-20 ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Circle icon */}
            <div className="bg-yellow-500 text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl shadow-lg z-20">
              {step.icon}
            </div>

            {/* Connector line curve */}
            <div
              className={`absolute w-20 h-20 border-t-4 border-l-4 border-yellow-400 rounded-tl-full z-0
              ${index % 2 === 0 ? "-left-10 md:-right-[2.5rem] rotate-90" : "-right-10 md:-left-[2.5rem] -rotate-90"}
              top-6 hidden md:block`}
            ></div>

            {/* Step content */}
            <div
              className={`bg-white shadow-md rounded-xl p-6 md:w-1/2 mt-6 md:mt-0 ${
                index % 2 === 0 ? "md:mr-8" : "md:ml-8"
              }`}
            >
              <h3 className="text-2xl font-semibold text-yellow-900 mb-2">
                {step.title}
              </h3>
              <p className="text-yellow-800 text-base">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
