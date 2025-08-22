import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call delay
		await new Promise(resolve => setTimeout(resolve, 1000));

		if (username.trim() && password.trim()) {
			setDialogMessage("Login successful! Welcome back.");
			setShowSuccessDialog(true);
			setIsLoading(false);
		} else {
			setIsLoading(false);
		}
	};

	const handleSignUp = () => {
		setDialogMessage("Account created successfully! Welcome to Perla's.");
		setShowSuccessDialog(true);
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const closeDialog = () => {
		setShowSuccessDialog(false);
		setUsername("");
		setPassword("");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center px-4 py-12">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-secondary-900 mb-2">
						Perla<span className="text-primary-600">'s</span>
					</h1>
					<p className="text-gray-600">Welcome back! Please sign in to your account.</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
					<h2 className="text-2xl font-bold text-secondary-900 text-center mb-6">
						Sign In
					</h2>
					
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
								Username
							</label>
							<input
								type="text"
								id="username"
								name="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter your username"
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 placeholder-gray-400"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									required
									className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 placeholder-gray-400"
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									{showPassword ? (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
										</svg>
									) : (
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Signing In...
								</div>
							) : (
								"Sign In"
							)}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<button
								onClick={handleSignUp}
								className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors duration-200"
							>
								Sign up
							</button>
						</p>
					</div>
				</div>
			</div>

			{/* Custom Success Dialog */}
			{showSuccessDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div 
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={closeDialog}
					/>
					
					{/* Dialog */}
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
						{/* Success Icon */}
						<div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
							<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
						</div>

						{/* Content */}
						<div className="pt-8 pb-6 px-6 text-center">
							<h3 className="text-xl font-bold text-gray-900 mb-3">
								Success!
							</h3>
							<p className="text-gray-600 mb-6">
								{dialogMessage}
							</p>
							
							{/* Action Buttons */}
							<div className="flex gap-3">
								<button
									onClick={closeDialog}
									className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
								>
									Close
								</button>
								<button
									onClick={() => {
										closeDialog();
										navigate("/menu");
									}}
									className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
								>
									Go to Menu
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Login;
