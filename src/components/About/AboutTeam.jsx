import React from "react";

const team = [
	{
		name: "Chef Maria Perla",
		role: "Head Chef & Founder",
		image: "/images/chef-maria.jpg",
		description:
			"With over 20 years of culinary experience, Chef Maria brings passion and creativity to every dish.",
	},
	{
		name: "Antonio Perla",
		role: "Restaurant Manager",
		image: "/images/antonio.jpg",
		description:
			"Ensuring every guest receives exceptional service and a memorable dining experience.",
	},
	{
		name: "Isabella Perla",
		role: "Pastry Chef",
		image: "/images/isabella.jpg",
		description:
			"Creating sweet masterpieces that are as beautiful as they are delicious.",
	},
];

const AboutTeam = () => {
	return (
		<div className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
						Meet Our Team
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						The passionate individuals behind every delicious meal
						and exceptional service.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{team.map((member, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
						>
							<div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
								<div className="text-6xl">👨‍🍳</div>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-bold text-secondary-900 mb-1">
									{member.name}
								</h3>
								<p className="text-primary-600 font-medium mb-3">
									{member.role}
								</p>
								<p className="text-gray-600 leading-relaxed">
									{member.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AboutTeam;
