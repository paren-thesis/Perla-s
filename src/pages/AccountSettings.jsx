import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AccountInfo from "../components/AccountSettings/AccountInfo";
import ProfileSettings from "../components/AccountSettings/ProfileSettings";
import NotificationPreferences from "../components/AccountSettings/NotificationPreferences";
import AccountActions from "../components/AccountSettings/AccountActions";
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
				<AccountInfo
					email={currentUser?.email}
					emailVerified={currentUser?.emailVerified}
				/>

				{/* Settings Sections */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<ProfileSettings />
					<NotificationPreferences />
				</div>

				{/* Logout Section */}
				<AccountActions
					onLogout={handleLogout}
					isLoggingOut={isLoggingOut}
				/>
			</div>
		</div>
	);
}

export default AccountSettings;
