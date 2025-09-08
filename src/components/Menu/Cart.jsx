import React from "react";

function Cart({
	items,
	onIncrement,
	onDecrement,
	onRemove,
	onSubmit,
	isMobile = false,
	onClearCart,
	isReadOnly = false,
}) {
	const total = items
		.reduce((acc, it) => acc + it.price * it.quantity, 0)
		.toFixed(2);

	const handleClearCart = () => {
		onClearCart();
	};

	if (isMobile) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-4 max-w-sm">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-lg font-bold text-secondary-900">
						Cart ({items.length})
					</h3>
					<button
						onClick={handleClearCart}
						className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
						title="Clear cart"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div className="text-sm font-semibold text-primary-600 mb-3 text-right">
					${total}
				</div>

				<div className="max-h-64 overflow-y-auto">
					<ul className="space-y-2">
						{items.map((it) => (
							<li
								key={it.id}
								className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0"
							>
								<img
									src={it.image}
									alt={it.name}
									className="w-10 h-10 rounded object-cover border border-gray-100"
								/>
								<div className="flex-1 min-w-0">
									<p className="font-medium text-secondary-900 text-sm truncate">
										{it.name}
									</p>
									<p className="text-xs text-gray-500">
										${it.price.toFixed(2)}
									</p>
								</div>
								{!isReadOnly ? (
									<>
										<div className="flex items-center gap-1">
											<button
												onClick={() => onDecrement(it.id)}
												className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-50 text-xs font-bold"
											>
												-
											</button>
											<span className="w-6 text-center text-sm font-semibold">
												{it.quantity}
											</span>
											<button
												onClick={() => onIncrement(it.id)}
												className="w-6 h-6 rounded border border-gray-200 hover:bg-gray-50 text-xs font-bold"
											>
												+
											</button>
										</div>
										<button
											onClick={() => onRemove(it.id)}
											className="text-xs text-red-600 hover:underline ml-1"
										>
											×
										</button>
									</>
								) : (
									<div className="flex items-center gap-2">
										<span className="text-sm text-gray-600">
											Qty: {it.quantity}
										</span>
									</div>
								)}
							</li>
						))}
					</ul>
				</div>

				{!isReadOnly && (
					<button
						onClick={onSubmit}
						className="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
					>
						Checkout (${total})
					</button>
				)}
			</div>
		);
	}

	// Desktop sidebar layout
	return (
		<aside className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xl font-bold text-secondary-900">Cart</h3>
				<div className="flex items-center gap-3">
					<span className="text-sm font-semibold text-gray-500">
						{items.length} item{items.length !== 1 ? "s" : ""}
					</span>
					{!isReadOnly && (
						<button
							onClick={handleClearCart}
							className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
							title="Clear cart"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			<div className="max-h-96 overflow-y-auto">
				<ul className="divide-y divide-gray-100">
					{items.map((it) => (
						<li
							key={it.id}
							className="py-3 flex items-center gap-3"
						>
							<img
								src={it.image}
								alt={it.name}
								className="w-14 h-14 rounded object-cover border border-gray-100"
							/>
							<div className="flex-1 min-w-0">
								<p className="font-semibold text-secondary-900 truncate">
									{it.name}
								</p>
								<p className="text-sm text-gray-500">
									${it.price.toFixed(2)}
								</p>
							</div>
							{!isReadOnly ? (
								<>
									<div className="flex items-center gap-2">
										<button
											onClick={() => onDecrement(it.id)}
											className="w-8 h-8 rounded border border-gray-200 hover:bg-gray-50 font-bold"
										>
											-
										</button>
										<span className="w-6 text-center font-semibold">
											{it.quantity}
										</span>
										<button
											onClick={() => onIncrement(it.id)}
											className="w-8 h-8 rounded border border-gray-200 hover:bg-gray-50 font-bold"
										>
											+
										</button>
									</div>
									<button
										onClick={() => onRemove(it.id)}
										className="text-xs text-red-600 hover:underline"
									>
										Remove
									</button>
								</>
							) : (
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-600">
										Qty: {it.quantity}
									</span>
								</div>
							)}
						</li>
					))}
				</ul>
			</div>

			<div className="mt-4 flex items-center justify-between">
				<span className="text-sm text-gray-600">Subtotal</span>
				<span className="text-lg font-bold text-secondary-900">
					${total}
				</span>
			</div>
			{!isReadOnly && (
				<button
					onClick={onSubmit}
					className="mt-4 w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
				>
					Proceed to Checkout
				</button>
			)}
		</aside>
	);
}

export default Cart;
