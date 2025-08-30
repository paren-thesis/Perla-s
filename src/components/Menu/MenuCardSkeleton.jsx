import React from "react";

function MenuCardSkeleton() {
	return (
		<div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
			{/* Image skeleton with shimmer */}
			<div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
				<div className="w-full h-full shimmer"></div>
			</div>

			<div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
				<div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
					<div className="flex-1 min-w-0">
						{/* Title skeleton */}
						<div className="h-5 sm:h-6 lg:h-7 bg-gray-200 rounded mb-2 w-3/4 shimmer"></div>
						{/* Description skeleton */}
						<div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 w-full shimmer"></div>
						<div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 shimmer"></div>
					</div>
					{/* Price skeleton */}
					<div className="h-5 sm:h-6 lg:h-7 bg-gray-200 rounded w-12 sm:w-16 shimmer"></div>
				</div>

				{/* Button skeleton */}
				<div className="mt-auto">
					<div className="w-full h-10 sm:h-11 lg:h-12 bg-gray-200 rounded-lg shimmer"></div>
				</div>
			</div>
		</div>
	);
}

export default MenuCardSkeleton;
