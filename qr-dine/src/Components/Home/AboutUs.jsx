// src/Components/AboutUs.jsx
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="relative bg-yellow-50 py-24 px-6 overflow-hidden">
      {/* Decorative Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1470&q=80')",
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold text-yellow-900 mb-6">
            Who Are We?
          </h2>
          <p className="text-lg text-yellow-800 leading-relaxed">
            At <span className="font-semibold text-yellow-900">TARS Mahal</span>, we're
            revolutionizing the way you enjoy your meal. No more waiting for
            menus or bills — just scan, order, and relax. We blend technology
            with hospitality to give you a seamless dining experience you
            deserve.
          </p>
          <p className="mt-6 text-yellow-700">
            Born out of the love for cafés and convenience, our team is on a
            mission to modernize traditional dining — one QR scan at a time.
          </p>
        </motion.div>

        {/* Image Card with Hover Effect */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="group relative w-full h-80 rounded-xl overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105">
            <img
              src="https://images.unsplash.com/photo-1578366941741-9e517759c620?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Cafe Team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-yellow-900 bg-opacity-60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-white text-center px-6">
              <h3 className="text-2xl font-bold mb-2">Made with ☕ & ❤️</h3>
              <p>By people who love great food and even better experiences.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
