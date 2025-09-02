import React, { createContext, useContext, useState, useEffect } from "react";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	async function signup(email, password) {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		await sendEmailVerification(userCredential.user);
		return userCredential;
	}

	function login(email, password) {
		return signInWithEmailAndPassword(auth, email, password);
	}

	function logout() {
		return signOut(auth);
	}

	function googleSignIn() {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		logout,
		googleSignIn,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
