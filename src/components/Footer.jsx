import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Footer = () => {
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
		<footer className="bg-secondary-900 text-gray-100 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
					{/* Brand Section */}
					<div className="lg:col-span-1">
						<div className="mb-6">
							<h3 className="text-2xl font-bold text-primary-500 mb-2">
								Perla<span className="text-white">'s</span>
							</h3>
							<p className="text-gray-300 text-sm leading-relaxed">
								Experience the finest dining with authentic
								flavors and warm hospitality.
							</p>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-lg font-semibold text-primary-400 mb-4">
							Quick Links
						</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/menu"
									className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
								>
									Menu
								</Link>
							</li>
							<li>
								{currentUser ? (
									<button
										onClick={handleLogout}
										disabled={isLoggingOut}
										className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm bg-transparent border-none cursor-pointer"
									>
										{isLoggingOut ? "Logging out..." : "Logout"}
									</button>
								) : (
									<Link
										to="/login"
										className="text-gray-300 hover:text-primary-400 transition-colors duration-200 text-sm"
									>
										Login
									</Link>
								)}
							</li>
						</ul>
					</div>

					{/* Opening Hours */}
					<div>
						<h4 className="text-lg font-semibold text-primary-400 mb-4">
							Opening Hours
						</h4>
						<ul className="space-y-2 text-sm">
							<li className="flex justify-between items-center">
								<span className="text-primary-400 font-medium">
									Monday - Friday:
								</span>
								<span className="text-gray-300">
									11:00 AM - 10:00 PM
								</span>
							</li>
							<li className="flex justify-between items-center">
								<span className="text-primary-400 font-medium">
									Saturday:
								</span>
								<span className="text-gray-300">
									10:00 AM - 11:00 PM
								</span>
							</li>
							<li className="flex justify-between items-center">
								<span className="text-primary-400 font-medium">
									Sunday:
								</span>
								<span className="text-gray-300">
									10:00 AM - 9:00 PM
								</span>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="text-lg font-semibold text-primary-400 mb-4">
							Contact Info
						</h4>
						<div className="space-y-2 text-sm">
							<p className="flex items-center text-gray-300">
								<span className="mr-2">📍</span>
								123 Restaurant Street, City, State 12345
							</p>
							<p className="flex items-center text-gray-300">
								<span className="mr-2">📞</span>
								(555) 123-4567
							</p>
							<p className="flex items-center text-gray-300">
								<span className="mr-2">✉️</span>
								info@perlas.com
							</p>
						</div>
					</div>

					{/* Social Media */}
					<div>
						<h4 className="text-lg font-semibold text-primary-400 mb-4">
							Follow Us
						</h4>
						<div className="flex space-x-3">
							<a
								href="#"
								aria-label="Facebook"
								className="w-10 h-10 bg-primary-500/10 border-2 border-primary-500 rounded-full flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
							<a
								href="#"
								aria-label="Instagram"
								className="w-10 h-10 bg-primary-500/10 border-2 border-primary-500 rounded-full flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
								</svg>
							</a>
							<a
								href="#"
								aria-label="Twitter"
								className="w-10 h-10 bg-primary-500/10 border-2 border-primary-500 rounded-full flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div className="border-t border-primary-500/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<p className="text-gray-400 text-sm">
							&copy; {new Date().getFullYear()} Perla's
							Restaurant. All rights reserved.
						</p>
						<div className="flex space-x-6">
							<a
								href="#"
								className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
							>
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
