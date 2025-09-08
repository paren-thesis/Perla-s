/**
 * Maps Firebase authentication error codes to user-friendly messages
 */
export const getAuthErrorMessage = (errorCode) => {
	const errorMessages = {
		// Authentication errors
		"auth/user-not-found":
			"No account found with this email address. Please check your email or create a new account.",
		"auth/wrong-password":
			"Incorrect password. Please try again or reset your password.",
		"auth/invalid-email": "Please enter a valid email address.",
		"auth/user-disabled":
			"This account has been disabled. Please contact support for assistance.",
		"auth/too-many-requests":
			"Too many failed attempts. Please try again later or reset your password.",
		"auth/operation-not-allowed":
			"This sign-in method is not enabled. Please contact support.",

		// Registration errors
		"auth/email-already-in-use":
			"An account with this email already exists. Please sign in instead or use a different email.",
		"auth/weak-password":
			"Password should be at least 6 characters long and include a mix of letters and numbers.",
		"auth/invalid-password": "Password should be at least 6 characters long.",

		// Network and general errors
		"auth/network-request-failed":
			"Network error. Please check your internet connection and try again.",
		"auth/internal-error":
			"Something went wrong on our end. Please try again in a moment.",
		"auth/timeout":
			"The request timed out. Please check your internet connection and try again.",

		// Google Sign-In errors
		"auth/popup-closed-by-user": "Sign-in was cancelled. Please try again.",
		"auth/popup-blocked":
			"Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.",
		"auth/cancelled-popup-request": "Sign-in was cancelled. Please try again.",
		"auth/account-exists-with-different-credential":
			"An account already exists with this email using a different sign-in method.",

		// Email verification errors
		"auth/invalid-action-code":
			"The verification link is invalid or has expired. Please request a new one.",
		"auth/expired-action-code":
			"The verification link has expired. Please request a new one.",
		"auth/user-token-expired":
			"Your session has expired. Please sign in again.",

		// Generic errors
		"auth/requires-recent-login":
			"For security reasons, please sign in again to complete this action.",
		"auth/credential-already-in-use":
			"This credential is already associated with a different account.",
		"auth/invalid-credential":
			"The provided credentials are invalid. Please try again.",
		"auth/missing-email": "Please enter your email address.",
		"auth/missing-password": "Please enter your password.",
	};

	return (
		errorMessages[errorCode] ||
		"An unexpected error occurred. Please try again or contact support if the problem persists."
	);
};

/**
 * Extracts and formats error message from Firebase error object
 */
export const formatAuthError = (error) => {
	if (!error) return "An unexpected error occurred.";

	// Handle Firebase auth errors
	if (error.code && error.code.startsWith("auth/")) {
		return getAuthErrorMessage(error.code);
	}

	// Handle network errors
	if (error.message && error.message.includes("network")) {
		return "Network error. Please check your internet connection and try again.";
	}

	// Handle other specific error messages
	if (error.message) {
		// Clean up Firebase error messages
		const cleanMessage = error.message
			.replace("Firebase: ", "")
			.replace(/\([^)]*\)/g, "") // Remove error codes in parentheses
			.trim();

		return cleanMessage || "An unexpected error occurred. Please try again.";
	}

	return "An unexpected error occurred. Please try again.";
};

/**
 * Validates email format
 */
export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validates password strength
 */
export const validatePassword = (password) => {
	const errors = [];

	if (password.length < 6) {
		errors.push("Password must be at least 6 characters long");
	}

	if (!/[A-Za-z]/.test(password)) {
		errors.push("Password must contain at least one letter");
	}

	if (!/\d/.test(password) && password.length < 8) {
		errors.push(
			"Password should contain at least one number for better security"
		);
	}

	return {
		isValid: errors.length === 0,
		errors,
		strength: getPasswordStrength(password),
	};
};

/**
 * Gets password strength level
 */
export const getPasswordStrength = (password) => {
	let score = 0;

	if (password.length >= 6) score += 1;
	if (password.length >= 8) score += 1;
	if (/[A-Z]/.test(password)) score += 1;
	if (/[a-z]/.test(password)) score += 1;
	if (/\d/.test(password)) score += 1;
	if (/[^A-Za-z0-9]/.test(password)) score += 1;

	if (score <= 2) return "weak";
	if (score <= 4) return "medium";
	return "strong";
};
