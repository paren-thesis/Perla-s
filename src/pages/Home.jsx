import React from "react";
import HeroSection from "../components/Home/HeroSection";
import TopListSection from "../components/Home/TopListSection";
import FrenchFriesSection from "../components/Home/FrenchFriesSection";
import ServicesSection from "../components/Home/ServicesSection";

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
