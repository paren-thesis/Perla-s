import React from "react";

function ClearCartDialog({ isOpen, onClose, onConfirm }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fadeIn">
				{/* Header */}
				<div className="bg-red-500 p-6 text-center">
					<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
				</div>

				{/* Content */}
				<div className="pt-8 pb-6 px-6 text-center">
					<h3 className="text-xl font-bold text-gray-900 mb-3">
						Clear Cart?
					</h3>
					<p className="text-gray-600 mb-6">
						Are you sure you want to clear your cart? This action
						cannot be undone.
					</p>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<button
							onClick={onClose}
							className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
						>
							Cancel
						</button>
						<button
							onClick={onConfirm}
							className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
						>
							Clear Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClearCartDialog;
