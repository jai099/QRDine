import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 text-center text-white">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
          “Good Food is Good Mood”
        </h1>
        <p className="mb-8 text-lg sm:text-xl md:text-2xl">
        Order your favorite dishes directly from your table.
        </p>
        <button
          className="rounded bg-yellow-400 px-8 py-3 font-semibold text-black hover:bg-yellow-500 sm:px-10 sm:py-4 sm:text-lg"
          // You can link this button to your menu page or QR logic page
          onClick={() => window.location.href = "/"}
        >
          View Menu
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
