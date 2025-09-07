// Updated Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthFormHeader from "../components/Auth/AuthFormHeader";
import AuthFormCard from "../components/Auth/AuthFormCard";
import PasswordField from "../components/Auth/PasswordField";
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";
import SuccessDialog from "../components/Auth/SuccessDialog";
import SubmitButton from "../components/Auth/SubmitButton";

function Login() {
	const [isMounted, setIsMounted] = useState(false);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const location = useLocation();
	const { login, signup, googleSignIn, currentUser } = useAuth();

	useEffect(() => {
		const timer = setTimeout(() => setIsMounted(true), 100);
		return () => clearTimeout(timer);
	}, []);

	// Redirect if user is already logged in
	useEffect(() => {
		if (currentUser) {
			if (currentUser.emailVerified) {
				// Check if user came from booking page
				const returnTo = location.state?.returnTo || "/menu";
				navigate(returnTo);
			} else {
				setDialogMessage(
					"Please verify your email before accessing the menu. Check your inbox for a verification link."
				);
				setShowSuccessDialog(true);
			}
		}
	}, [currentUser, navigate, location.state]);

	const validateForm = () => {
		const newErrors = {};

		if (!email.trim()) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(email))
			newErrors.email = "Email is invalid";
		if (!password.trim()) newErrors.password = "Password is required";

		if (!isLoginMode) {
			if (password !== confirmPassword)
				newErrors.confirmPassword = "Passwords do not match";
			if (password.length < 6)
				newErrors.password = "Password should be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);

		try {
			if (isLoginMode) {
				await login(email, password);
				setDialogMessage("Login successful! Welcome back.");
				setShowSuccessDialog(true);
			} else {
				await signup(email, password);
				setDialogMessage(
					"Account created successfully! Please check your email and verify your account before logging in."
				);
				setShowSuccessDialog(true);
			}
		} catch (error) {
			console.error("Authentication error:", error);
			setErrors({
				submit:
					error.message || "An error occurred during authentication",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			await googleSignIn();
			setDialogMessage("Login with Google successful!");
			setShowSuccessDialog(true);
		} catch (error) {
			console.error("Google sign-in error:", error);
			setErrors({
				submit:
					error.message || "An error occurred during Google sign-in",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoginRedirect = () => {
		setShowLoginDialog(false);
		// Restore cart items and redirect back to menu
		navigate("/menu", {
			state: {
				fromLogin: true,
				cartItems: location.state?.cartItems || [],
			},
		});
	};

	const toggleMode = () => {
		setIsLoginMode(!isLoginMode);
		setPassword("");
		setConfirmPassword("");
		setEmail("");
		setErrors({});
	};

	const closeDialog = () => {
		setShowSuccessDialog(false);
		setPassword("");
		setConfirmPassword("");
		setEmail("");
	};

	const isFormValid = () => {
		if (isLoginMode) {
			return email.trim() && password.trim();
		} else {
			return (
				email.trim() && password.trim() && password === confirmPassword
			);
		}
	};

	const handleForgotPassword = () => {
		alert("Forgot password feature coming soon!");
	};

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center px-4 py-12 pt-24 md:pt-28 transition-all duration-700 ease-out ${
				isMounted ? "opacity-100" : "opacity-0"
			}`}
		>
			<div className="max-w-md w-full">
				<AuthFormHeader isLoginMode={isLoginMode} />

				<AuthFormCard title={isLoginMode ? "Sign In" : "Sign Up"}>
					{errors.submit && (
						<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
							{errors.submit}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setErrors((prev) => ({
										...prev,
										email: "",
									}));
								}}
								placeholder="Enter your email"
								className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 placeholder-gray-400 ${
									errors.email
										? "border-red-300"
										: "border-gray-300"
								}`}
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{errors.email}
								</p>
							)}
						</div>

						{/* Password Field */}
						<PasswordField
							id="password"
							label="Password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setErrors((prev) => ({
									...prev,
									password: "",
								}));
							}}
							placeholder="Enter your password"
							error={errors.password}
							showForgotPassword={isLoginMode}
							showStrengthIndicator={!isLoginMode}
							onForgotPassword={handleForgotPassword}
						/>

						{/* Confirm Password Field - Only for Sign Up */}
						{!isLoginMode && (
							<PasswordField
								id="confirmPassword"
								label="Confirm Password"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setErrors((prev) => ({
										...prev,
										confirmPassword: "",
									}));
								}}
								placeholder="Confirm your password"
								error={errors.confirmPassword}
							/>
						)}

						{/* Submit Button */}
						<SubmitButton
							isLoading={isLoading}
							isLoginMode={isLoginMode}
							disabled={isLoading || !isFormValid()}
						/>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								or
							</span>
						</div>
					</div>

					{/* Continue with Google Button */}
					<GoogleSignInButton
						onClick={handleGoogleSignIn}
						disabled={isLoading}
						isLoading={isLoading}
					/>

					{/* Toggle Mode */}
					<div className="mt-6 text-center">
						<p className="text-gray-600">
							{isLoginMode
								? "Don't have an account?"
								: "Already have an account?"}{" "}
							<button
								onClick={toggleMode}
								className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors duration-200"
							>
								{isLoginMode ? "Sign up" : "Sign in"}
							</button>
						</p>
					</div>
				</AuthFormCard>
			</div>

			{/* Success Dialog */}
			<SuccessDialog
				isOpen={showSuccessDialog}
				message={dialogMessage}
				onClose={closeDialog}
				onNavigateToMenu={() => {
					closeDialog();
					const returnTo = location.state?.returnTo || "/menu";
					navigate(returnTo);
				}}
			/>
		</div>
	);
}

export default Login;
