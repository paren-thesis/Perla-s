import React from "react";

function AccountInfo({ email, emailVerified }) {
	return (
		<div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
			<h2 className="text-xl font-semibold text-secondary-900 mb-4">
				Account Information
			</h2>
			<div className="space-y-4">
				<div className="flex items-center space-x-4">
					<div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
						<span className="text-white text-2xl font-bold">
							{email ? email[0].toUpperCase() : "U"}
						</span>
					</div>
					<div>
						<p className="text-lg font-medium text-gray-900">
							{email || "User"}
						</p>
						<p className="text-sm text-gray-500">
							{emailVerified
								? "Verified account"
								: "Email not verified"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AccountInfo;
