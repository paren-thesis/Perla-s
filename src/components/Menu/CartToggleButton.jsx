import React from "react";

function CartToggleButton({ totalQuantity, totalPrice, onClick, isMobile }) {
	if (isMobile) {
		return (
			<button
				onClick={onClick}
				className="fixed bottom-5 right-5 z-50 lg:hidden inline-flex items-center gap-2 px-3 h-12 rounded-full shadow-lg border border-primary-200 bg-white text-secondary-900 focus:outline-none focus-visible:ring-2 ring-primary-500 ring-offset-2"
				aria-label="Toggle cart"
			>
				<span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold">
					{totalQuantity}
				</span>
				<span className="text-sm font-semibold">${totalPrice}</span>
			</button>
		);
	}

	return (
		<button
			onClick={onClick}
			className="hidden lg:inline-flex fixed bottom-6 right-6 z-50 items-center gap-3 px-4 h-12 rounded-full shadow-lg border border-primary-200 bg-white text-secondary-900 hover:shadow-xl transition focus:outline-none focus-visible:ring-2 ring-primary-500 ring-offset-2"
			aria-label="Toggle cart"
		>
			<span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold">
				{totalQuantity}
			</span>
			<span className="text-sm font-semibold text-gray-600">Cart</span>
			<span className="text-sm font-bold text-secondary-900">
				${totalPrice}
			</span>
		</button>
	);
}

export default CartToggleButton;
