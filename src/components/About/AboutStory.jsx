import React from "react";

const AboutStory = () => {
	return (
		<div className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
							Our Story
						</h2>
						<div className="space-y-6 text-gray-700 leading-relaxed">
							<p className="text-lg">
								Welcome to{" "}
								<strong className="text-secondary-900">
									Perla's
								</strong>
								, where passion meets flavor! We are a
								family-owned restaurant dedicated to serving
								delicious, high-quality meals made from the
								freshest ingredients.
							</p>
							<p className="text-lg">
								Our journey began in 2010 with a simple mission:
								to create a dining experience that feels like
								home. What started as a small family kitchen has
								grown into a beloved destination for food lovers
								everywhere.
							</p>
							<p className="text-lg">
								At Perla's, we believe that food is more than
								just sustenance—it's an art form. Our chefs are
								passionate about crafting dishes that delight
								the senses and bring people together.
							</p>
						</div>
					</div>
					<div className="relative">
						<div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-8 text-white">
							<h3 className="text-2xl font-bold mb-4">
								Our Mission
							</h3>
							<p className="text-lg leading-relaxed">
								To create memorable dining experiences through
								exceptional food, warm hospitality, and a
								commitment to quality that exceeds expectations.
							</p>
						</div>
						<div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
							<div className="text-4xl">🏆</div>
							<p className="text-sm text-gray-600 mt-2">
								Award Winning
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutStory;
