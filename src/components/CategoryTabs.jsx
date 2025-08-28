import React, { useState, useEffect, useRef } from "react";

function CategoryTabs({ categories, selected, onChange }) {
	const [isVisible, setIsVisible] = useState(false);
	const tabsRef = useRef(null);

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

		if (tabsRef.current) {
			observer.observe(tabsRef.current);
		}

		return () => {
			if (tabsRef.current) {
				observer.unobserve(tabsRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={tabsRef}
			className={`w-full overflow-x-auto transition-all duration-700 ease-out ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-4"
			}`}
		>
			<div className="inline-flex gap-2 sm:gap-3 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
				{categories.map((cat) => (
					<button
						key={cat.value}
						onClick={() => onChange(cat.value)}
						className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 ring-primary-500 ring-offset-2 ${
							selected === cat.value
								? "bg-primary-600 text-white shadow"
								: "bg-transparent text-gray-700 hover:bg-gray-100"
						}`}
					>
						<span className="mr-2 capitalize">{cat.label}</span>
						<span
							className={`inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-bold ${
								selected === cat.value
									? "bg-white/20 text-white"
									: "bg-gray-200 text-gray-700"
							}`}
						>
							{cat.count}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}

export default CategoryTabs;
