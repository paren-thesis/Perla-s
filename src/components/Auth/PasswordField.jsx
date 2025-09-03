import React, { useState } from "react";

function PasswordField({
	id,
	label,
	value,
	onChange,
	placeholder,
	error,
	showForgotPassword = false,
	showStrengthIndicator = false,
	onForgotPassword,
}) {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const getPasswordStrength = (password) => {
		if (!password)
			return { strength: "", width: "0%", color: "bg-gray-200" };
		if (password.length >= 6)
			return { strength: "Strong", width: "100%", color: "bg-green-500" };
		return {
			strength: "Weak",
			width: `${(password.length / 6) * 100}%`,
			color: "bg-yellow-500",
		};
	};

	const strength = showStrengthIndicator ? getPasswordStrength(value) : null;

	return (
		<div>
			<label
				htmlFor={id}
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				{label}
			</label>
			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					id={id}
					name={id}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 placeholder-gray-400 ${
						error ? "border-red-300" : "border-gray-300"
					}`}
				/>
				<button
					type="button"
					onClick={togglePasswordVisibility}
					className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
				>
					{showPassword ? (
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
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
							/>
						</svg>
					) : (
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
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					)}
				</button>
			</div>

			{/* Forgot Password Link */}
			{showForgotPassword && (
				<div className="text-right mt-2">
					<button
						type="button"
						onClick={onForgotPassword}
						className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline transition-colors"
					>
						Forgot password?
					</button>
				</div>
			)}

			{/* Password Strength Indicator */}
			{showStrengthIndicator && value && (
				<div className="mt-2">
					<div className="flex justify-between text-xs text-gray-500 mb-1">
						<span>Password strength:</span>
						<span
							className={
								strength.strength === "Strong"
									? "text-green-600 font-medium"
									: "text-yellow-600 font-medium"
							}
						>
							{strength.strength}
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-1">
						<div
							className={`h-1 rounded-full transition-all duration-300 ${strength.color}`}
							style={{ width: strength.width }}
						></div>
					</div>
				</div>
			)}

			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</div>
	);
}

export default PasswordField;
