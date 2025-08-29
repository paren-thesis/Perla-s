import React from "react";
import AboutHero from "../components/About/AboutHero";
import AboutStats from "../components/About/AboutStats";
import AboutStory from "../components/About/AboutStory";
import AboutValues from "../components/About/AboutValues";
import AboutTeam from "../components/About/AboutTeam";
import AboutCTA from "../components/About/AboutCTA";
import AnimatedSection from "../components/AnimatedSection";

function About() {
	return (
		<div className="min-h-screen bg-white">
			<AnimatedSection delay={100}>
				<AboutHero />
			</AnimatedSection>
			<AnimatedSection delay={200}>
				<AboutStats />
			</AnimatedSection>
			<AboutStory />
			<AboutValues />
			<AboutTeam />
			<AboutCTA />
		</div>
	);
}

export default About;
