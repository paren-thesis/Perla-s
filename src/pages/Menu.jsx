import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs";
import MenuCard from "../components/MenuCard";
import Cart from "../components/Cart";

const menuItems = [
	{
		id: 1,
		name: "French Toast",
		category: "breakfast",
		price: 12.99,
		description: "Classic French toast with maple syrup",
		image: "/images/foods/french_toast.jpeg",
	},
	{
		id: 2,
		name: "Caesar Salad",
		category: "lunch",
		price: 10.99,
		description: "Fresh romaine lettuce with caesar dressing",
		image: "/images/foods/caesar_salad.jpg",
	},
	{
		id: 3,
		name: "Chicken Wings",
		category: "lunch",
		price: 14.99,
		description: "Crispy chicken wings with your choice of sauce",
		image: "/images/foods/chicken_wings.jpg",
	},
	{
		id: 4,
		name: "Garlic Bread",
		category: "starters",
		price: 6.99,
		description: "Toasted bread with garlic butter",
		image: "/images/foods/garlic_bread.jpeg",
	},
	{
		id: 5,
		name: "Tiramisu",
		category: "desserts",
		price: 8.99,
		description: "Classic Italian dessert",
		image: "/images/foods/tiramisu.jpeg",
	},
	{
		id: 6,
		name: "Eggs Benedict",
		category: "breakfast",
		price: 13.99,
		description: "Poached eggs with hollandaise sauce",
		image: "/images/foods/eggs_benedict.jpg",
	},
	{
		id: 7,
		name: "Mozzarella Sticks",
		category: "starters",
		price: 7.99,
		description: "Crispy breaded mozzarella sticks",
		image: "/images/foods/mozzarella_sticks.jpeg",
	},
	{
		id: 8,
		name: "Pasta Alfredo",
		category: "lunch",
		price: 15.99,
		description: "Creamy pasta with parmesan sauce",
		image: "/images/foods/pasta_alfredo.jpg",
	},
	{
		id: 9,
		name: "Chocolate Cake",
		category: "desserts",
		price: 6.99,
		description: "Rich chocolate layer cake",
		image: "/images/foods/chocolate_cake.jpg",
	},
	{
		id: 10,
		name: "Spring Rolls",
		category: "starters",
		price: 8.99,
		description: "Crispy vegetable spring rolls",
		image: "/images/foods/spring_rolls.jpg",
	},
];

function Menu() {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [cartItems, setCartItems] = useState([]); // { id, name, price, image, quantity }
	const [isCartOpen, setIsCartOpen] = useState(false);

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
			{ label: "Starters", value: "starters", count: counts["starters"] || 0 },
			{ label: "Breakfast", value: "breakfast", count: counts["breakfast"] || 0 },
			{ label: "Lunch", value: "lunch", count: counts["lunch"] || 0 },
			{ label: "Desserts", value: "desserts", count: counts["desserts"] || 0 },
		];
	}, []);

	const filteredItems = useMemo(
		() =>
			selectedCategory === "all"
				? menuItems
				: menuItems.filter((item) => item.category === selectedCategory),
		[selectedCategory]
	);

	const addToCart = (item) => {
		setCartItems((prev) => {
			const found = prev.find((it) => it.id === item.id);
			if (found) {
				return prev.map((it) =>
					it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
				);
			}
			return [
				...prev,
				{
					id: item.id,
					name: item.name,
					price: item.price,
					image: item.image,
					quantity: 1,
				},
			];
		});
	};

	const increment = (id) => {
		setCartItems((prev) =>
			prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it))
		);
	};

	const decrement = (id) => {
		setCartItems((prev) => {
			const target = prev.find((it) => it.id === id);
			if (!target) return prev;
			if (target.quantity <= 1) return prev.filter((it) => it.id !== id);
			return prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity - 1 } : it));
		});
	};

	const removeFromCart = (id) => {
		setCartItems((prev) => prev.filter((it) => it.id !== id));
	};

	const handleSubmit = () => {
		if (cartItems.length === 0) {
			alert("Please add items to your cart first!");
			return;
		}
		alert("You need an account to complete checkout. Redirecting to login...");
		navigate("/login");
	};

	const totalQuantity = useMemo(
		() => cartItems.reduce((acc, it) => acc + it.quantity, 0),
		[cartItems]
	);

	const totalPrice = useMemo(
		() => cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0).toFixed(2),
		[cartItems]
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 text-center mb-6">
						Menu
					</h1>
					<div className="flex justify-center">
						<CategoryTabs
							categories={categories}
							selected={selectedCategory}
							onChange={setSelectedCategory}
						/>
					</div>
				</div>

				{/* Menu Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{filteredItems.map((item) => (
						<MenuCard key={item.id} item={item} onAdd={addToCart} />
					))}
				</div>
			</div>

			{/* Bubble Toggle - Mobile Count Only */}
			{cartItems.length > 0 && (
				<button
					onClick={() => setIsCartOpen((v) => !v)}
					className="fixed bottom-5 right-5 z-50 lg:hidden inline-flex items-center gap-2 px-3 h-12 rounded-full shadow-lg border border-primary-200 bg-white text-secondary-900 focus:outline-none focus-visible:ring-2 ring-primary-500 ring-offset-2"
					aria-label="Toggle cart"
				>
					<span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold">{totalQuantity}</span>
					<span className="text-sm font-semibold">${totalPrice}</span>
				</button>
			)}

			{/* Bubble Toggle - Desktop Count + Subtotal */}
			{cartItems.length > 0 && (
				<button
					onClick={() => setIsCartOpen((v) => !v)}
					className="hidden lg:inline-flex fixed bottom-6 right-6 z-50 items-center gap-3 px-4 h-12 rounded-full shadow-lg border border-primary-200 bg-white text-secondary-900 hover:shadow-xl transition focus:outline-none focus-visible:ring-2 ring-primary-500 ring-offset-2"
					aria-label="Toggle cart"
				>
					<span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold">
						{totalQuantity}
					</span>
					<span className="text-sm font-semibold text-gray-600">Cart</span>
					<span className="text-sm font-bold text-secondary-900">${totalPrice}</span>
				</button>
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
							isMobile={true}
						/>
						<button
							onClick={() => setIsCartOpen(false)}
							className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow border border-gray-200 text-secondary-900 hover:bg-gray-50"
							title="Close"
						>
							×
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
								isMobile={false}
							/>
							<button
								onClick={() => setIsCartOpen(false)}
								className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow border border-gray-200 text-secondary-900 hover:bg-gray-50"
								title="Close"
							>
								×
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Menu;
