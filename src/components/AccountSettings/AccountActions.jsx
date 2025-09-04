import React from "react";

function AccountActions({ onLogout, isLoggingOut }) {
	return (
		<div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
			<h3 className="text-lg font-semibold text-secondary-900 mb-4">
				Account Actions
			</h3>
			<div className="flex flex-col sm:flex-row gap-4">
				<button
					onClick={onLogout}
					disabled={isLoggingOut}
					className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50"
				>
					{isLoggingOut ? "Logging out..." : "Logout"}
				</button>
				<button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200">
					Delete Account
				</button>
			</div>
		</div>
	);
}

export default AccountActions;
