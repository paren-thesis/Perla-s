import React from "react";

function LoginRequiredDialog({ isOpen, onClose, onLoginRedirect }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fadeIn">
				{/* Header */}
				<div className="bg-primary-500 p-6 text-center">
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
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
				</div>

				{/* Content */}
				<div className="pt-8 pb-6 px-6 text-center">
					<h3 className="text-xl font-bold text-gray-900 mb-3">
						Login Required
					</h3>
					<p className="text-gray-600 mb-6">
						You need to be logged in to complete your order. Please
						sign in or create an account.
					</p>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<button
							onClick={onClose}
							className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
						>
							Not Now
						</button>
						<button
							onClick={onLoginRedirect}
							className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
						>
							Login / Sign Up
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginRequiredDialog;
