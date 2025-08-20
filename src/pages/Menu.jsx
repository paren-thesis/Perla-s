import React, { useState, useEffect } from "react";
import "./Menu.css";

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
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [cartItems, setCartItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState(menuItems);

	useEffect(() => {
		if (selectedCategory === "all") {
			setFilteredItems(menuItems);
		} else {
			setFilteredItems(
				menuItems.filter((item) => item.category === selectedCategory)
			);
		}
	}, [selectedCategory]);

	const addToCart = (item) => {
		setCartItems([...cartItems, item]);
	};

	const removeFromCart = (itemId) => {
		setCartItems(cartItems.filter((item) => item.id !== itemId));
	};

	const calculateTotal = () => {
		return cartItems
			.reduce((total, item) => total + item.price, 0)
			.toFixed(2);
	};

	const submitOrder = () => {
		if (cartItems.length === 0) {
			alert("Please add items to your cart first!");
			return;
		}
		alert("Order submitted successfully!");
		setCartItems([]);
	};

	return (
		<div className="menu-container">
			<h1 className="menu-title">The Most Popular</h1>

			<div className="category-nav">
				<button
					className={`category-btn ${
						selectedCategory === "all" ? "active" : ""
					}`}
					onClick={() => setSelectedCategory("all")}
				>
					All
				</button>
				<button
					className={`category-btn ${
						selectedCategory === "starters" ? "active" : ""
					}`}
					onClick={() => setSelectedCategory("starters")}
				>
					Starters
				</button>
				<button
					className={`category-btn ${
						selectedCategory === "breakfast" ? "active" : ""
					}`}
					onClick={() => setSelectedCategory("breakfast")}
				>
					Breakfast
				</button>
				<button
					className={`category-btn ${
						selectedCategory === "lunch" ? "active" : ""
					}`}
					onClick={() => setSelectedCategory("lunch")}
				>
					Lunch
				</button>
				<button
					className={`category-btn ${
						selectedCategory === "desserts" ? "active" : ""
					}`}
					onClick={() => setSelectedCategory("desserts")}
				>
					Desserts
				</button>
			</div>

			<div className="menu-grid">
				{filteredItems.map((item) => (
					<div key={item.id} className="menu-item">
						<img src={item.image} alt={item.name} />
						<h3>{item.name}</h3>
						<p>{item.description}</p>
						<p className="price">${item.price}</p>
						<button
							className="btn-submit"
							onClick={() => addToCart(item)}
						>
							Add to Cart
						</button>
					</div>
				))}
			</div>

			<div className="cart">
				<h3>Cart</h3>
				<ul className="cart-items">
					{cartItems.map((item, index) => (
						<li key={index}>
							<span>{item.name}</span>
							<span>${item.price}</span>
							<button onClick={() => removeFromCart(item.id)}>
								Remove
							</button>
						</li>
					))}
				</ul>
				<p>Total: ${calculateTotal()}</p>
				<button className="btn-submit" onClick={submitOrder}>
					Submit Order
				</button>
			</div>
		</div>
	);
}

export default Menu;
