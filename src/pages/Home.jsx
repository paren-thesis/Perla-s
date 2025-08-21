import React from "react";
import HeroSection from "../components/HeroSection";
import TopListSection from "../components/TopListSection";
import FrenchFriesSection from "../components/FrenchFriesSection";
import ServicesSection from "../components/ServicesSection";

function Home() {
  return (
    <div className="home">
      <HeroSection />
      <TopListSection />
      <FrenchFriesSection />
      <ServicesSection />
    </div>
  );
}

export default Home;
