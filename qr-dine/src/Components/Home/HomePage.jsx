import React from "react";
import Navbar from "./Navbar";        // Adjust path if Navbar is elsewhere
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import AboutUs from "./AboutUs";
import FeaturedDishes from "./FeaturedDishes";

const HomePage = () => {
  return (
    <>
      <Navbar />
          <HeroSection />
          <HowItWorks />
          <section id="about">
  <AboutUs />
          </section>
          <FeaturedDishes />


      {/* You can add more homepage sections here later */}
    </>
  );
};

export default HomePage;
