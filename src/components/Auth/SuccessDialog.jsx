import React from "react";

function SuccessDialog({ isOpen, message, onClose, onNavigateToMenu }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Dialog */}
			<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
				{/* Success Icon */}
				<div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
					<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
						<svg
							className="w-6 h-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
				</div>

				{/* Content */}
				<div className="pt-8 pb-6 px-6 text-center">
					<h3 className="text-xl font-bold text-gray-900 mb-3">
						Success!
					</h3>
					<p className="text-gray-600 mb-6">{message}</p>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<button
							onClick={onClose}
							className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
						>
							Close
						</button>
						<button
							onClick={onNavigateToMenu}
							className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
						>
							Go to Menu
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SuccessDialog;
