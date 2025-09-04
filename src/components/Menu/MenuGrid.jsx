import React from "react";
import MenuCard from "./MenuCard";
import MenuCardSkeleton from "./MenuCardSkeleton";

function MenuGrid({
	isLoading,
	isCategoryChanging,
	filteredItems,
	menuItems,
	selectedCategory,
	onAddToCart,
}) {
	const getSkeletonCount = () => {
		if (selectedCategory === "all") return 8;
		const categoryCount = menuItems.filter(
			(item) => item.category === selectedCategory
		).length;
		return Math.max(4, categoryCount);
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
			{isLoading || isCategoryChanging
				? Array.from({ length: getSkeletonCount() }).map((_, index) => (
						<MenuCardSkeleton key={`skeleton-${index}`} />
				  ))
				: filteredItems.map((item) => (
						<MenuCard
							key={item.id}
							item={item}
							onAdd={onAddToCart}
						/>
				  ))}
		</div>
	);
}

export default MenuGrid;
