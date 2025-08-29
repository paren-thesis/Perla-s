import React from "react";

const values = [
	{
		icon: "🍽️",
		title: "Quality First",
		description:
			"We source only the finest ingredients and maintain the highest standards in food preparation.",
	},
	{
		icon: "👨‍👩‍👧‍👦",
		title: "Family Values",
		description:
			"Our restaurant is built on the foundation of family, bringing warmth and care to every dish.",
	},
	{
		icon: "🌟",
		title: "Excellence",
		description:
			"We strive for excellence in every aspect of our service, from food to customer experience.",
	},
	{
		icon: "🌱",
		title: "Sustainability",
		description:
			"Committed to eco-friendly practices and supporting local farmers and suppliers.",
	},
];

const AboutValues = () => {
	return (
		<div className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
						Our Core Values
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						The principles that guide everything we do and make
						Perla's more than just a restaurant.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{values.map((value, index) => (
						<div key={index} className="text-center group">
							<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
								{value.icon}
							</div>
							<h3 className="text-xl font-bold text-secondary-900 mb-3">
								{value.title}
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{value.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AboutValues;
