import React, { useState, useEffect, useRef } from "react";

function MenuCard({ item, onAdd }) {
	const [isVisible, setIsVisible] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const cardRef = useRef(null);
	const imgRef = useRef(null);

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

		if (cardRef.current) {
			observer.observe(cardRef.current);
		}

		return () => {
			if (cardRef.current) {
				observer.unobserve(cardRef.current);
			}
		};
	}, []);

	// Check if image is already cached or loaded
	useEffect(() => {
		if (imgRef.current && imgRef.current.complete) {
			setImageLoaded(true);
		}
	}, []);

	const handleImageLoad = () => {
		setImageLoaded(true);
	};

	const handleImageError = () => {
		setImageLoaded(true); // Still remove skeleton even if image fails
	};

	return (
		<div
			ref={cardRef}
			className={`group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-700 ease-out ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-6"
			}`}
		>
			<div className="relative aspect-[4/3] overflow-hidden">
				<img
					ref={imgRef}
					src={item.image}
					alt={item.name}
					className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
					onLoad={handleImageLoad}
					onError={handleImageError}
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				{/* Loading overlay */}
				{!imageLoaded && (
					<div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
						<div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				)}
			</div>

			{/* Show skeleton content until image loads */}
			{!imageLoaded ? (
				<div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col animate-pulse">
					<div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
						<div className="flex-1 min-w-0">
							<div className="h-5 sm:h-6 lg:h-7 bg-gray-200 rounded mb-2 w-3/4"></div>
							<div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 w-full"></div>
							<div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
						<div className="h-5 sm:h-6 lg:h-7 bg-gray-200 rounded w-12 sm:w-16"></div>
					</div>
					<div className="mt-auto">
						<div className="w-full h-10 sm:h-11 lg:h-12 bg-gray-200 rounded-lg"></div>
					</div>
				</div>
			) : (
				<div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
					<div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
						<div className="flex-1 min-w-0">
							<h3 className="text-base sm:text-lg lg:text-xl font-semibold text-secondary-900 leading-tight">
								{item.name}
							</h3>
							<p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
								{item.description}
							</p>
						</div>
						<div className="text-primary-600 text-lg sm:text-xl lg:text-2xl font-bold whitespace-nowrap flex-shrink-0">
							${item.price}
						</div>
					</div>
					<div className="mt-auto">
						<button
							onClick={() => onAdd(item)}
							className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm sm:text-base font-semibold shadow hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
						>
							Add to Cart
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default MenuCard;
