import React from "react";

function AuthFormCard({ title, children }) {
	return (
		<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
			<h2 className="text-2xl font-bold text-secondary-900 text-center mb-6">
				{title}
			</h2>
			{children}
		</div>
	);
}

export default AuthFormCard;
