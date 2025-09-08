import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, ApiError } from "../services/api";

const ApiAuthContext = createContext();

export function useApiAuth() {
	return useContext(ApiAuthContext);
}

export function ApiAuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Enhanced signup function
	async function signup(email, password, firstName, lastName, phone) {
		try {
			const response = await apiClient.register({
				email,
				password,
				firstName,
				lastName,
				phone
			});

			// Auto-login after successful registration
			await login(email, password);

			return {
				success: true,
				user: response.user,
				message: 'Account created successfully!'
			};
		} catch (error) {
			console.error('Signup error:', error);
			throw {
				success: false,
				message: error.message || 'Registration failed',
				code: error.status
			};
		}
	}

	// Enhanced login function
	async function login(email, password) {
		try {
			const response = await apiClient.login(email, password);
			
			setCurrentUser(response.user);
			
			return {
				success: true,
				user: response.user,
				message: 'Successfully signed in!'
			};
		} catch (error) {
			console.error('Login error:', error);
			throw {
				success: false,
				message: error.message || 'Login failed',
				code: error.status
			};
		}
	}

	// Enhanced logout function
	async function logout() {
		try {
			await apiClient.logout();
			setCurrentUser(null);
			return { success: true };
		} catch (error) {
			console.error('Logout error:', error);
			// Even if API call fails, clear local state
			setCurrentUser(null);
			return { success: true };
		}
	}

	// Google Sign-In function (placeholder - would need OAuth setup)
	async function googleSignIn() {
		// This would need to be implemented with OAuth
		throw {
			success: false,
			message: 'Google sign-in not yet implemented with backend API'
		};
	}

	// Send password reset email (placeholder)
	async function resetPassword(email) {
		// This would need to be implemented
		throw {
			success: false,
			message: 'Password reset not yet implemented with backend API'
		};
	}

	// Resend verification email (placeholder)
	async function resendVerificationEmail() {
		// This would need to be implemented
		throw {
			success: false,
			message: 'Email verification not yet implemented with backend API'
		};
	}

	// Check if user's email is verified (placeholder)
	async function checkEmailVerification() {
		// This would need to be implemented
		return true;
	}

	// Update user profile
	async function updateProfile(profileData) {
		try {
			const response = await apiClient.updateProfile(profileData);
			setCurrentUser(response.user);
			return {
				success: true,
				user: response.user,
				message: 'Profile updated successfully!'
			};
		} catch (error) {
			console.error('Update profile error:', error);
			throw {
				success: false,
				message: error.message || 'Profile update failed',
				code: error.status
			};
		}
	}

	// Change password
	async function changePassword(currentPassword, newPassword) {
		try {
			await apiClient.changePassword({ currentPassword, newPassword });
			return {
				success: true,
				message: 'Password changed successfully!'
			};
		} catch (error) {
			console.error('Change password error:', error);
			throw {
				success: false,
				message: error.message || 'Password change failed',
				code: error.status
			};
		}
	}

	// Load current user on app start
	useEffect(() => {
		const loadUser = async () => {
			try {
				const response = await apiClient.getCurrentUser();
				setCurrentUser(response.user);
			} catch (error) {
				// User not authenticated or token expired
				setCurrentUser(null);
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, []);

	useEffect(() => {
		// Clear cart if user logs out
		if (!currentUser) {
			localStorage.removeItem("perlasCart");
		}
	}, [currentUser]);

	const value = {
		currentUser,
		signup,
		login,
		logout,
		googleSignIn,
		resetPassword,
		resendVerificationEmail,
		checkEmailVerification,
		updateProfile,
		changePassword,
	};

	return (
		<ApiAuthContext.Provider value={value}>
			{!loading && children}
		</ApiAuthContext.Provider>
	);
}