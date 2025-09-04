import React from "react";

const AnimatedSection = ({ children, delay = 0, className = "" }) => {
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), delay);
		return () => clearTimeout(timer);
	}, [delay]);

	return (
		<div
			className={`transition-all duration-700 ease-out ${className} ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-8"
			}`}
		>
			{children}
		</div>
	);
};

export default AnimatedSection;
