import React from "react";

function SubmitButton({ isLoading, isLoginMode, disabled }) {
	return (
		<button
			type="submit"
			disabled={disabled}
			className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
		>
			{isLoading && (
				<div className="absolute inset-0 bg-primary-600 animate-pulse"></div>
			)}
			<span className="relative z-10">
				{isLoading ? (
					<div className="flex items-center justify-center">
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
						{isLoginMode ? "Signing In..." : "Creating Account..."}
					</div>
				) : isLoginMode ? (
					"Sign In"
				) : (
					"Create Account"
				)}
			</span>
		</button>
	);
}

export default SubmitButton;
