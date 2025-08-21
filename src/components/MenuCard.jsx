import React from "react";

function MenuCard({ item, onAdd }) {
	return (
		<div className="group bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
			<div className="relative aspect-[4/3] overflow-hidden">
				<img
					src={item.image}
					alt={item.name}
					className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>
			<div className="p-4 sm:p-5">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h3 className="text-lg sm:text-xl font-semibold text-secondary-900">
							{item.name}
						</h3>
						<p className="text-gray-600 text-sm mt-1 line-clamp-2">
							{item.description}
						</p>
					</div>
					<div className="text-primary-600 text-xl sm:text-2xl font-bold whitespace-nowrap">
						${item.price}
					</div>
				</div>
				<div className="mt-4">
					<button
						onClick={() => onAdd(item)}
						className="w-full inline-flex items-center justify-center px-4 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
}

export default MenuCard;
