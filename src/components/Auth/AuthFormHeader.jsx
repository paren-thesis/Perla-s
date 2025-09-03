import React from "react";

function AuthFormHeader({ isLoginMode }) {
	return (
		<div className="text-center mb-8">
			<h1 className="text-4xl font-bold text-secondary-900 mb-2">
				Perla<span className="text-primary-600">'s</span>
			</h1>
			<p className="text-gray-600">
				{isLoginMode
					? "Welcome back! Please sign in to your account."
					: "Create your account to get started."}
			</p>
		</div>
	);
}

export default AuthFormHeader;
