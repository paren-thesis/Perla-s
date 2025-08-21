import React from "react";

function Cart({ items, onIncrement, onDecrement, onRemove, onSubmit }) {
	const total = items
		.reduce((acc, it) => acc + it.price * it.quantity, 0)
		.toFixed(2);

	return (
		<aside className="bg-white rounded-2xl border border-gray-100 shadow p-4 sm:p-6 sticky top-24">
			<h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center justify-between">
				<span>Cart</span>
				<span className="text-sm font-semibold text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""}</span>
			</h3>

			{items.length === 0 ? (
				<p className="text-gray-500 text-sm">Your cart is empty.</p>
			) : (
				<>
					<ul className="divide-y divide-gray-100">
						{items.map((it) => (
							<li key={it.id} className="py-3 flex items-center gap-3">
								<img src={it.image} alt={it.name} className="w-14 h-14 rounded object-cover border border-gray-100" />
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-secondary-900 truncate">{it.name}</p>
									<p className="text-sm text-gray-500">${it.price.toFixed(2)}</p>
								</div>
								<div className="flex items-center gap-2">
									<button onClick={() => onDecrement(it.id)} className="w-8 h-8 rounded border border-gray-200 hover:bg-gray-50">-</button>
									<span className="w-6 text-center font-semibold">{it.quantity}</span>
									<button onClick={() => onIncrement(it.id)} className="w-8 h-8 rounded border border-gray-200 hover:bg-gray-50">+</button>
								</div>
								<button onClick={() => onRemove(it.id)} className="ml-2 text-xs text-red-600 hover:underline">Remove</button>
							</li>
						))}
					</ul>
					<div className="mt-4 flex items-center justify-between">
						<span className="text-sm text-gray-600">Subtotal</span>
						<span className="text-lg font-bold text-secondary-900">${total}</span>
					</div>
					<button
						onClick={onSubmit}
						className="mt-4 w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200"
					>
						Proceed to Checkout
					</button>
				</>
			)}
		</aside>
	);
}

export default Cart;
