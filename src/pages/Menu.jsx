import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import MenuHeader from "../components/Menu/MenuHeader";
import MenuGrid from "../components/Menu/MenuGrid";
import Cart from "../components/Menu/Cart";
import CartToggleButton from "../components/Menu/CartToggleButton";
import ClearCartDialog from "../components/Menu/ClearCartDialog";
import LoginRequiredDialog from "../components/Menu/LoginRequiredDialog";
import LoadingProgress from "../components/LoadingProgress";
import menuItems from "../components/Menu/menuItems";
import { useImagePreloader } from "../hooks/useImagePreloader";

function Menu() {
	const navigate = useNavigate();
	const location = useLocation();
	const { currentUser } = useAuth();
	const {
		cart,
		addToCart: addToFirestoreCart,
		updateCartItem,
		removeFromCart: removeFromFirestoreCart,
		clearUserCart,
		syncLocalCart
	} = useFirestore();

	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [showLoginDialog, setShowLoginDialog] = useState(false);
	const [showClearCartDialog, setShowClearCartDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isCategoryChanging, setIsCategoryChanging] = useState(false);

	// Source of truth for cart items
	const cartItems = cart.items || [];

	// Extract all image sources for preloading
	const allImageSources = useMemo(() => {
		return menuItems.map(item => item.image);
	}, []);

	// Get priority images (first few items or featured items)
	const priorityImages = useMemo(() => {
		return menuItems.slice(0, 6).map(item => item.image);
	}, []);

	// Use image preloader
	const imagePreloader = useImagePreloader(allImageSources, {
		priority: priorityImages,
		batchSize: 4,
		delay: 200
	});

	// Check for cart restoration after login redirect
	useEffect(() => {
		if (location.state?.fromLogin && cartItems.length > 0) {
			setIsCartOpen(true);
			// Clear the state to prevent reopening on refresh
			window.history.replaceState({}, document.title);
		}
	}, [location.state, cartItems]);

	// Simulate initial loading
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800);
		return () => clearTimeout(timer);
	}, []);

	// Handle category changes with loading state
	const handleCategoryChange = (category) => {
		setIsCategoryChanging(true);
		setSelectedCategory(category);

		setTimeout(() => {
			setIsCategoryChanging(false);
		}, 400);
	};

	useEffect(() => {
		if (cartItems.length === 0 && isCartOpen) setIsCartOpen(false);
	}, [cartItems, isCartOpen]);

	const categories = useMemo(() => {
		const counts = menuItems.reduce((acc, item) => {
			acc[item.category] = (acc[item.category] || 0) + 1;
			return acc;
		}, {});
		return [
			{ label: "All", value: "all", count: menuItems.length },
			{
				label: "Starters",
				value: "starters",
				count: counts["starters"] || 0,
			},
			{
				label: "Breakfast",
				value: "breakfast",
				count: counts["breakfast"] || 0,
			},
			{ label: "Lunch", value: "lunch", count: counts["lunch"] || 0 },
			{
				label: "Desserts",
				value: "desserts",
				count: counts["desserts"] || 0,
			},
			{
				label: "Beverages",
				value: "beverages",
				count: counts["beverages"] || 0,
			},
		];
	}, []);

	const filteredItems = useMemo(
		() =>
			selectedCategory === "all"
				? menuItems
				: menuItems.filter(
					(item) => item.category === selectedCategory
				),
		[selectedCategory]
	);

	const addToCart = async (item) => {
		try {
			await addToFirestoreCart(item);
		} catch (error) {
			console.error("Error adding to cart:", error);
			alert("Failed to add to cart. Please try again.");
		}
	};

	const increment = (id) => {
		const item = cartItems.find(i => i.id === id);
		if (item) updateCartItem(id, item.quantity + 1);
	};

	const decrement = (id) => {
		const item = cartItems.find(i => i.id === id);
		if (item) updateCartItem(id, item.quantity - 1);
	};

	const removeFromCart = (id) => {
		removeFromFirestoreCart(id);
	};

	const clearCart = () => {
		clearUserCart();
		setShowClearCartDialog(false);
	};

	const handleSubmit = () => {
		if (cartItems.length === 0) {
			alert("Please add items to your cart first!");
			return;
		}

		if (currentUser) {
			// User is logged in, proceed to checkout
			navigate("/checkout");
		} else {
			// User not logged in, show login dialog
			setShowLoginDialog(true);
		}
	};

	const handleLoginRedirect = () => {
		setShowLoginDialog(false);
		// Pass cart items in state to restore after login
		navigate("/login", {
			state: {
				from: "menu",
				cartItems: cartItems,
			},
		});
	};

	const closeLoginDialog = () => {
		setShowLoginDialog(false);
	};

	const totalQuantity = useMemo(
		() => cartItems.reduce((acc, it) => acc + it.quantity, 0),
		[cartItems]
	);

	const totalPrice = useMemo(
		() =>
			cartItems
				.reduce((acc, it) => acc + it.price * it.quantity, 0)
				.toFixed(2),
		[cartItems]
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<LoadingProgress
				progress={imagePreloader.stats.progress}
				isVisible={imagePreloader.isLoading && imagePreloader.stats.progress < 100}
				message={`Loading menu images... (${imagePreloader.stats.loaded}/${imagePreloader.stats.total})`}
				showPercentage={true}
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8">
				<MenuHeader
					categories={categories}
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
				/>

				<MenuGrid
					isLoading={isLoading}
					isCategoryChanging={isCategoryChanging}
					filteredItems={filteredItems}
					menuItems={menuItems}
					selectedCategory={selectedCategory}
					onAddToCart={addToCart}
				/>
			</div>

			{/* Cart Toggle Buttons */}
			{cartItems.length > 0 && (
				<>
					<CartToggleButton
						totalQuantity={totalQuantity}
						totalPrice={totalPrice}
						onClick={() => setIsCartOpen((v) => !v)}
						isMobile={true}
					/>
					<CartToggleButton
						totalQuantity={totalQuantity}
						totalPrice={totalPrice}
						onClick={() => setIsCartOpen((v) => !v)}
						isMobile={false}
					/>
				</>
			)}

			{/* Mobile Bottom Sheet Cart */}
			{cartItems.length > 0 && isCartOpen && (
				<div className="lg:hidden fixed inset-x-0 bottom-0 z-50 p-4">
					<div className="relative">
						<Cart
							items={cartItems}
							onIncrement={increment}
							onDecrement={decrement}
							onRemove={removeFromCart}
							onSubmit={handleSubmit}
							onClearCart={() => setShowClearCartDialog(true)}
							isMobile={true}
						/>
						<button
							onClick={() => setIsCartOpen(false)}
							className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow border border-gray-200 text-secondary-900 hover:bg-gray-50"
							title="Minimize"
						>
							-
						</button>
					</div>
				</div>
			)}

			{/* Desktop Modal Overlay Cart with Blur */}
			{cartItems.length > 0 && isCartOpen && (
				<div className="hidden lg:block fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => setIsCartOpen(false)}
					/>
					<div className="absolute top-24 right-8 w-[32rem] max-w-[92vw]">
						<div className="relative">
							<Cart
								items={cartItems}
								onIncrement={increment}
								onDecrement={decrement}
								onRemove={removeFromCart}
								onSubmit={handleSubmit}
								onClearCart={() => setShowClearCartDialog(true)}
								isMobile={false}
							/>
							<button
								onClick={() => setIsCartOpen(false)}
								className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow border border-gray-200 text-secondary-900 hover:bg-gray-50"
								title="Minimize"
							>
								-
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Dialogs */}
			<ClearCartDialog
				isOpen={showClearCartDialog}
				onClose={() => setShowClearCartDialog(false)}
				onConfirm={clearCart}
			/>

			<LoginRequiredDialog
				isOpen={showLoginDialog}
				onClose={closeLoginDialog}
				onLoginRedirect={handleLoginRedirect}
			/>
		</div>
	);
}

export default Menu;
