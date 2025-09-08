import React, { createContext, useContext, useState, useEffect } from "react";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	sendEmailVerification,
	sendPasswordResetEmail,
	reload,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Enhanced signup function with email verification
	async function signup(email, password) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Send verification email with custom settings
			await sendEmailVerification(userCredential.user, {
				url: window.location.origin + '/login',
				handleCodeInApp: false,
			});

			return {
				success: true,
				user: userCredential.user,
				message: 'Account created successfully! Please check your email for verification.'
			};
		} catch (error) {
			console.error('Signup error:', error);
			throw {
				success: false,
				message: formatAuthError(error),
				code: error.code
			};
		}
	}

	// Enhanced login function with better error handling
	async function login(email, password) {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);

			// Check if email is verified
			if (!userCredential.user.emailVerified) {
				return {
					success: false,
					user: userCredential.user,
					message: 'Please verify your email address before signing in. Check your inbox for the verification link.',
					needsVerification: true
				};
			}

			return {
				success: true,
				user: userCredential.user,
				message: 'Successfully signed in!'
			};
		} catch (error) {
			console.error('Login error:', error);
			throw {
				success: false,
				message: formatAuthError(error),
				code: error.code
			};
		}
	}

	// Enhanced logout function
	async function logout() {
		try {
			await signOut(auth);
			return { success: true };
		} catch (error) {
			console.error('Logout error:', error);
			throw {
				success: false,
				message: formatAuthError(error)
			};
		}
	}

	// Enhanced Google Sign-In function
	async function googleSignIn() {
		try {
			const provider = new GoogleAuthProvider();
			provider.setCustomParameters({
				prompt: 'select_account'
			});

			const result = await signInWithPopup(auth, provider);
			return {
				success: true,
				user: result.user,
				message: 'Successfully signed in with Google!'
			};
		} catch (error) {
			console.error('Google sign-in error:', error);
			throw {
				success: false,
				message: formatAuthError(error),
				code: error.code
			};
		}
	}

	// Send password reset email
	async function resetPassword(email) {
		try {
			await sendPasswordResetEmail(auth, email, {
				url: window.location.origin + '/login',
				handleCodeInApp: false,
			});
			return {
				success: true,
				message: 'Password reset email sent! Check your inbox for instructions.'
			};
		} catch (error) {
			console.error('Password reset error:', error);
			throw {
				success: false,
				message: formatAuthError(error),
				code: error.code
			};
		}
	}

	// Resend verification email
	async function resendVerificationEmail() {
		try {
			if (!currentUser) {
				throw new Error('No user signed in');
			}

			// Reload user to get latest verification status
			await reload(currentUser);

			if (currentUser.emailVerified) {
				return {
					success: false,
					message: 'Your email is already verified!'
				};
			}

			await sendEmailVerification(currentUser, {
				url: window.location.origin + '/login',
				handleCodeInApp: false,
			});

			return {
				success: true,
				message: 'Verification email sent! Please check your inbox.'
			};
		} catch (error) {
			console.error('Resend verification error:', error);
			throw {
				success: false,
				message: formatAuthError(error),
				code: error.code
			};
		}
	}

	// Check if user's email is verified (refresh from server)
	async function checkEmailVerification() {
		try {
			if (!currentUser) return false;

			await reload(currentUser);
			return currentUser.emailVerified;
		} catch (error) {
			console.error('Email verification check error:', error);
			return false;
		}
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);

			// Clear cart if user logs out
			if (!user) {
				localStorage.removeItem("perlasCart");
			}
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		logout,
		googleSignIn,
		resetPassword,
		resendVerificationEmail,
		checkEmailVerification,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
