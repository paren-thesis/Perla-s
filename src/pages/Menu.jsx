import React, { useMemo, useState } from "react";
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

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
				<h1 className="text-3xl sm:text-4xl font-bold text-secondary-900">The Most Popular</h1>
				<CategoryTabs
					categories={categories}
					selected={selectedCategory}
					onChange={setSelectedCategory}
				/>
			</div>

			{/* Content */}
			<div className="grid lg:grid-cols-12 gap-8">
				<div className="lg:col-span-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
						{filteredItems.map((item) => (
							<MenuCard key={item.id} item={item} onAdd={addToCart} />
						))}
					</div>
				</div>
				<div className="lg:col-span-4">
					<Cart
						items={cartItems}
						onIncrement={increment}
						onDecrement={decrement}
						onRemove={removeFromCart}
						onSubmit={handleSubmit}
					/>
				</div>
			</div>
		</div>
	);
}

export default Menu;
