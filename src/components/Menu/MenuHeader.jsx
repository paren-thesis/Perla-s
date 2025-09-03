import React from "react";
import CategoryTabs from "./CategoryTabs";

function MenuHeader({ categories, selectedCategory, onCategoryChange }) {
	return (
		<div className="mb-8">
			<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 text-center mb-6">
				Menu
			</h1>
			<div className="flex justify-center">
				<CategoryTabs
					categories={categories}
					selected={selectedCategory}
					onChange={onCategoryChange}
				/>
			</div>
		</div>
	);
}

export default MenuHeader;
