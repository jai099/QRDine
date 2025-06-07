import React from "react";
import Navbar from "./Navbar";        // Adjust path if Navbar is elsewhere
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";

const HomePage = () => {
  return (
    <>
      <Navbar />
          <HeroSection />
          <HowItWorks />

      {/* You can add more homepage sections here later */}
    </>
  );
};

export default HomePage;
