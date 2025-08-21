import React from "react";

function MenuCard({ item, onAdd }) {
	return (
		<div className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
			<div className="relative aspect-[4/3] overflow-hidden">
				<img
					src={item.image}
					alt={item.name}
					className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>
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
		</div>
	);
}

export default MenuCard;
