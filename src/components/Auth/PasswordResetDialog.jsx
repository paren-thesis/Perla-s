import React, { useState } from "react";
import {
	FaKey,
	FaEnvelope,
	FaCheckCircle,
	FaExclamationTriangle,
	FaSpinner,
} from "react-icons/fa";
import { isValidEmail } from "../../utils/authErrors";

const PasswordResetDialog = ({
	isOpen,
	onClose,
	onResetPassword,
	initialEmail = "",
}) => {
	const [email, setEmail] = useState(initialEmail);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState(""); // success, error
	const [emailSent, setEmailSent] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email.trim()) {
			setMessage("Please enter your email address.");
			setMessageType("error");
			return;
		}

		if (!isValidEmail(email)) {
			setMessage("Please enter a valid email address.");
			setMessageType("error");
			return;
		}

		setIsLoading(true);
		setMessage("");

		try {
			const result = await onResetPassword(email);
			setMessage(result.message);
			setMessageType(result.success ? "success" : "error");

			if (result.success) {
				setEmailSent(true);
			}
		} catch (error) {
			setMessage(
				error.message ||
					"Failed to send password reset email. Please try again."
			);
			setMessageType("error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setEmail("");
		setMessage("");
		setMessageType("");
		setEmailSent(false);
		onClose();
	};

	const getMessageIcon = () => {
		switch (messageType) {
			case "success":
				return <FaCheckCircle className="text-green-500" />;
			case "error":
				return <FaExclamationTriangle className="text-red-500" />;
			default:
				return null;
		}
	};

	const getMessageBgColor = () => {
		switch (messageType) {
			case "success":
				return "bg-green-50 text-green-800 border-green-200";
			case "error":
				return "bg-red-50 text-red-800 border-red-200";
			default:
				return "";
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
				{/* Header */}
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
						<FaKey className="w-8 h-8 text-primary-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Reset Password
					</h2>
					<p className="text-gray-600">
						{emailSent
							? "Check your email for reset instructions"
							: "Enter your email to receive password reset instructions"}
					</p>
				</div>

				{/* Message */}
				{message && (
					<div
						className={`mb-4 p-3 rounded-lg border flex items-start space-x-2 ${getMessageBgColor()}`}
					>
						{getMessageIcon()}
						<p className="text-sm flex-1">{message}</p>
					</div>
				)}

				{!emailSent ? (
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						{/* Email Input */}
						<div>
							<label
								htmlFor="reset-email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								<FaEnvelope className="inline mr-2 text-primary-500" />
								Email Address
							</label>
							<input
								type="email"
								id="reset-email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setMessage("");
								}}
								placeholder="Enter your email address"
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
								disabled={isLoading}
								autoFocus
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading || !email.trim()}
							className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
						>
							{isLoading ? (
								<>
									<FaSpinner className="animate-spin mr-2" />
									Sending Reset Email...
								</>
							) : (
								"Send Reset Email"
							)}
						</button>

						{/* Cancel Button */}
						<button
							type="button"
							onClick={handleClose}
							className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
							disabled={isLoading}
						>
							Cancel
						</button>
					</form>
				) : (
					<div className="space-y-4">
						{/* Success State */}
						<div className="bg-primary-50 rounded-lg p-4">
							<h3 className="font-semibold text-primary-900 mb-2">
								What's Next?
							</h3>
							<ol className="text-sm text-primary-800 space-y-1 list-decimal list-inside">
								<li>Check your email inbox (including spam/junk folder)</li>
								<li>Click the password reset link in the email</li>
								<li>Follow the instructions to create a new password</li>
								<li>Return to sign in with your new password</li>
							</ol>
						</div>

						{/* Actions */}
						<div className="space-y-2">
							<button
								onClick={() => {
									setEmailSent(false);
									setMessage("");
									setMessageType("");
								}}
								className="w-full bg-white border-2 border-primary-500 text-primary-600 py-2 px-4 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-200"
							>
								Send to Different Email
							</button>
							<button
								onClick={handleClose}
								className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
							>
								Close
							</button>
						</div>

						{/* Help Text */}
						<div className="text-center">
							<p className="text-xs text-gray-500">
								Didn't receive the email? Check your spam folder or try again
								with a different email address.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PasswordResetDialog;
