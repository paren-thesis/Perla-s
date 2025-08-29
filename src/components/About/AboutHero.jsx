import React from "react";

const AboutHero = () => {
	return (
		<div className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 pt-24 md:pt-28 pb-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
						About <span className="text-primary-600">Perla's</span>
					</h1>
					<p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
						Where passion meets flavor, and every meal tells a story
						of tradition, innovation, and the love of good food.
					</p>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
			<div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
			<div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
		</div>
	);
};

export default AboutHero;
