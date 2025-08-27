import React, { useState, useEffect, useRef } from "react";
import {
	FaCalendarAlt,
	FaUtensils,
	FaUserFriends,
	FaTruck,
} from "react-icons/fa";

const ServicesSection = () => {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					const timer = setTimeout(() => setIsVisible(true), 100);
					return () => clearTimeout(timer);
				}
			},
			{ threshold: 0.1 }
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => {
			if (sectionRef.current) {
				observer.unobserve(sectionRef.current);
			}
		};
	}, []);

	const services = [
		{
			id: 1,
			title: "Online Booking",
			description:
				"Reserve your table instantly with our easy-to-use online booking system",
			icon: FaCalendarAlt,
			color: "from-blue-500 to-blue-600",
			bgColor: "from-blue-50 to-blue-100",
		},
		{
			id: 2,
			title: "Catering Service",
			description:
				"Professional catering for events, parties, and special occasions",
			icon: FaUtensils,
			color: "from-primary-500 to-primary-600",
			bgColor: "from-primary-50 to-primary-100",
		},
		{
			id: 3,
			title: "Membership",
			description:
				"Join our loyalty program for exclusive benefits and rewards",
			icon: FaUserFriends,
			color: "from-green-500 to-green-600",
			bgColor: "from-green-50 to-green-100",
		},
		{
			id: 4,
			title: "Delivery Service",
			description: "Fast and reliable delivery to your doorstep",
			icon: FaTruck,
			color: "from-purple-500 to-purple-600",
			bgColor: "from-purple-50 to-purple-100",
		},
	];

	return (
		<section
			ref={sectionRef}
			className="py-12 sm:py-16 lg:py-20 bg-white px-4"
		>
			<div className="max-w-7xl mx-auto">
				{/* Section Header */}
				<div
					className={`text-center mb-12 sm:mb-16 transition-all duration-700 ease-out ${
						isVisible
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-8"
					}`}
				>
					<h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary-600 mb-3 sm:mb-4">
						Our Services
					</h3>
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-3 sm:mb-4">
						We provide this and many more for our cherished
						customers
					</h2>
					<div className="w-20 sm:w-24 h-1 bg-primary-500 mx-auto mt-3 sm:mt-4 rounded-full"></div>
				</div>

				{/* Services Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{services.map((service, index) => {
						const IconComponent = service.icon;
						return (
							<div
								key={service.id}
								className={`group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden transition-all duration-700 ease-out ${
									isVisible
										? "opacity-100 translate-y-0"
										: "opacity-0 translate-y-8"
								}`}
								style={{
									transitionDelay: isVisible
										? `${index * 100}ms`
										: "0ms",
								}}
							>
								{/* Background Pattern */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
								></div>

								{/* Content */}
								<div className="relative z-10 text-center">
									{/* Icon */}
									<div
										className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
									>
										<IconComponent className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300" />
									</div>

									{/* Title */}
									<h4 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors duration-300">
										{service.title}
									</h4>

									{/* Description */}
									<p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
										{service.description}
									</p>

									{/* Learn More Button */}
									<button
										className={`inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r ${service.color} rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
									>
										Learn More
										<svg
											className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5l7 7-7 7"
											/>
										</svg>
									</button>
								</div>

								{/* Hover Effect Border */}
								<div
									className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
								></div>
							</div>
						);
					})}
				</div>

				{/* Bottom CTA */}
				<div
					className={`text-center mt-12 sm:mt-16 transition-all duration-700 ease-out ${
						isVisible
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-8"
					}`}
					style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
				>
					<button className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-primary-600 bg-white border-2 border-primary-500 rounded-full hover:bg-primary-50 hover:border-primary-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
						<FaUtensils className="mr-2" />
						Explore All Services
					</button>
				</div>
			</div>
		</section>
	);
};

export default ServicesSection;
