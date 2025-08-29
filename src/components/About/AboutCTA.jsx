import React from "react";

const AboutCTA = () => {
	return (
		<div className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
			<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
					Ready to Experience Perla's?
				</h2>
				<p className="text-xl text-primary-100 mb-8 leading-relaxed">
					Join us and discover why Perla's has become a beloved
					destination for food lovers everywhere. We look forward to
					serving you!
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-200 shadow-lg">
						View Our Menu
					</button>
					<button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transform hover:-translate-y-1 transition-all duration-200">
						Book a Table
					</button>
				</div>
			</div>
		</div>
	);
};

export default AboutCTA;
