import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AccountSettings() {
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();
	const [isLoggingOut, setIsLoggingOut] = React.useState(false);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			await logout();
			navigate("/");
		} catch (error) {
			console.error("Failed to log out:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-secondary-900 mb-2">
						Account Settings
					</h1>
					<p className="text-gray-600">
						Manage your account preferences and information
					</p>
				</div>

				{/* Account Card */}
				<div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
					<h2 className="text-xl font-semibold text-secondary-900 mb-4">
						Account Information
					</h2>

					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
								<span className="text-white text-2xl font-bold">
									{currentUser?.email
										? currentUser.email[0].toUpperCase()
										: "U"}
								</span>
							</div>
							<div>
								<p className="text-lg font-medium text-gray-900">
									{currentUser?.email || "User"}
								</p>
								<p className="text-sm text-gray-500">
									{currentUser?.emailVerified
										? "Verified account"
										: "Email not verified"}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Settings Sections */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* Profile Settings */}
					<div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
						<h3 className="text-lg font-semibold text-secondary-900 mb-4">
							Profile Settings
						</h3>
						<div className="space-y-3">
							<div className="p-3 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-600">
									Coming soon...
								</p>
							</div>
						</div>
					</div>

					{/* Notification Preferences */}
					<div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
						<h3 className="text-lg font-semibold text-secondary-900 mb-4">
							Notifications
						</h3>
						<div className="space-y-3">
							<div className="p-3 bg-gray-50 rounded-lg">
								<p className="text-sm text-gray-600">
									Coming soon...
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Logout Section */}
				<div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
					<h3 className="text-lg font-semibold text-secondary-900 mb-4">
						Account Actions
					</h3>
					<div className="flex flex-col sm:flex-row gap-4">
						<button
							onClick={handleLogout}
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
			</div>
		</div>
	);
}

export default AccountSettings;
