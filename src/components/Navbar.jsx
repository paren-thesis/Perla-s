import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApiAuth } from "../contexts/ApiAuthContext";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isAccountOpen, setIsAccountOpen] = useState(false); // New state for account dropdown
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser, logout } = useApiAuth();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const closeMenu = () => {
		setIsOpen(false);
		setIsAccountOpen(false);
	};

	const toggleAccountDropdown = () => {
		setIsAccountOpen(!isAccountOpen);
	};

	const isActive = (path) => location.pathname === path;

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			const result = await logout();
			if (result.success) {
				navigate("/");
			}
		} catch (error) {
			console.error("Failed to log out:", error.message || error);
			// Still navigate to home even if there's an error
			navigate("/");
		} finally {
			setIsLoggingOut(false);
			closeMenu();
		}
	};

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 lg:h-20">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2 group">
						<div className="relative">
							<div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
								<span className="text-white font-bold text-xl">
									P
								</span>
							</div>
							<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-400 rounded-full"></div>
						</div>
						<div className="flex flex-col">
							<span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
								Perla
								<span className="text-primary-500">'s</span>
							</span>
							<span className="text-xs text-gray-500 -mt-1 font-medium">
								RESTAURANT
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-8">
						<NavLink to="/" isActive={isActive} onClick={closeMenu}>
							Home
						</NavLink>
						<NavLink
							to="/menu"
							isActive={isActive}
							onClick={closeMenu}
						>
							Menu
						</NavLink>
						<NavLink
							to="/book-table"
							isActive={isActive}
							onClick={closeMenu}
						>
							Book a Table
						</NavLink>
						<NavLink
							to="/about"
							isActive={isActive}
							onClick={closeMenu}
						>
							About Us
						</NavLink>

						{currentUser ? (
							<div className="flex items-center space-x-4">
								<div className="relative group">
									<button className="flex items-center space-x-2 focus:outline-none">
										<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
											<span className="text-white text-sm font-medium">
												{currentUser.email
													? currentUser.email[0].toUpperCase()
													: "U"}
											</span>
										</div>
									</button>

									{/* Account Dropdown */}
									<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
										<div className="py-2">
											<div className="px-4 py-2 border-b border-gray-100">
												<p className="text-sm font-medium text-gray-900 truncate">
													{currentUser.email}
												</p>
											</div>
											<Link
												to="/account"
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200"
												onClick={closeMenu}
											>
												Account Settings
											</Link>
											<button
												onClick={handleLogout}
												disabled={isLoggingOut}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200 disabled:opacity-50"
											>
												{isLoggingOut
													? "Logging out..."
													: "Logout"}
											</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<NavLink
								to="/login"
								isActive={isActive}
								onClick={closeMenu}
							>
								Login
							</NavLink>
						)}
					</div>

					{/* CTA Button */}
					<div className="hidden lg:block">
						<Link
							to="/book-table"
							className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-primary-600 hover:to-primary-700"
						>
							Reserve Now
						</Link>
					</div>

					{/* Mobile menu button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary-500 hover:bg-gray-100 transition-colors duration-200"
						aria-label="Toggle menu"
					>
						<div className="w-6 h-6 flex flex-col justify-center items-center">
							<span
								className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
									isOpen
										? "rotate-45 translate-y-1"
										: "-translate-y-1"
								}`}
							></span>
							<span
								className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
									isOpen ? "opacity-0" : "opacity-100"
								}`}
							></span>
							<span
								className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
									isOpen
										? "-rotate-45 -translate-y-1"
										: "translate-y-1"
								}`}
							></span>
						</div>
					</button>
				</div>

				{/* Mobile Navigation */}
				<div
					className={`lg:hidden transition-all duration-300 ease-in-out ${
						isOpen
							? "max-h-96 opacity-100 visible"
							: "max-h-0 opacity-0 invisible"
					}`}
				>
					<div className="pb-4 space-y-2">
						<MobileNavLink
							to="/"
							isActive={isActive}
							onClick={closeMenu}
						>
							Home
						</MobileNavLink>
						<MobileNavLink
							to="/menu"
							isActive={isActive}
							onClick={closeMenu}
						>
							Menu
						</MobileNavLink>
						<MobileNavLink
							to="/book-table"
							isActive={isActive}
							onClick={closeMenu}
						>
							Book a Table
						</MobileNavLink>
						<MobileNavLink
							to="/about"
							isActive={isActive}
							onClick={closeMenu}
						>
							About Us
						</MobileNavLink>

						{currentUser ? (
							<>
								{/* Mobile Account Section */}
								<div className="px-4 py-3">
									<button
										onClick={toggleAccountDropdown}
										className="w-full flex items-center space-x-3 text-left bg-primary-50 rounded-lg"
									>
										<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
											<span className="text-white text-sm font-medium">
												{currentUser.email
													? currentUser.email[0].toUpperCase()
													: "U"}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900 truncate">
												{currentUser.email || "User"}
											</p>
										</div>
										<svg
											className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
												isAccountOpen
													? "rotate-180"
													: ""
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{/* Mobile Account Dropdown */}
									<div
										className={`mt-2 ml-11 space-y-2 transition-all duration-200 ${
											isAccountOpen
												? "max-h-32 opacity-100"
												: "max-h-0 opacity-0 overflow-hidden"
										}`}
									>
										<Link
											to="/account"
											onClick={closeMenu}
											className="block px-3 py-2 text-sm text-gray-700 bg-primary-50 hover:bg-primary-100 hover:text-primary-600 rounded-lg transition-colors duration-200"
										>
											Account Settings
										</Link>
										<button
											onClick={handleLogout}
											disabled={isLoggingOut}
											className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-primary-50 hover:bg-primary-100 hover:text-primary-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
										>
											{isLoggingOut
												? "Logging out..."
												: "Logout"}
										</button>
									</div>
								</div>
							</>
						) : (
							<MobileNavLink
								to="/login"
								isActive={isActive}
								onClick={closeMenu}
							>
								Login
							</MobileNavLink>
						)}

						<div className="pt-4">
							<Link
								to="/book-table"
								onClick={closeMenu}
								className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
							>
								Reserve Now
							</Link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

// Desktop Navigation Link Component
const NavLink = ({ to, children, isActive, onClick }) => (
	<Link
		to={to}
		onClick={onClick}
		className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
			isActive
				? "text-primary-600"
				: "text-gray-700 hover:text-primary-600"
		}`}
	>
		{children}
		<span
			className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform transition-all duration-300 ${
				isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
			}`}
		></span>
	</Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, children, isActive, onClick }) => (
	<Link
		to={to}
		onClick={onClick}
		className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
			isActive
				? "bg-primary-50 text-primary-600 border-l-4 border-primary-500"
				: "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
		}`}
	>
		{children}
	</Link>
);

export default Navbar;
