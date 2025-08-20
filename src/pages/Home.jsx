import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
	const navigate = useNavigate();

	const handleBookTable = () => {
		// Implement booking table functionality
		alert("Table booking feature coming soon!");
	};

	return (
		<div className="home">
			<section className="hero">
				<div className="hero-text">
					<h1>Delicious Food Is Waiting For You</h1>
					<p>
						Our team of registered cooks and chefs provide you with
						the best continental dishes and provide you with the
						best services to your satisfaction
					</p>
					<div className="buttons">
						<button
							className="food-menu"
							onClick={() => navigate("/menu")}
						>
							Menu
						</button>
						<button
							className="book-table"
							onClick={handleBookTable}
						>
							Book a Table
						</button>
					</div>
				</div>
				<img
					src="/images/jollof1.png"
					alt="Delicious Food Bowl"
					className="hero-image"
				/>
			</section>

			<section className="top-list" id="top-list">
				<h2>Top List</h2>
				<h3>Our Mainstay Menu</h3>
				<div className="menu-items">
					<div className="menu-item">
						<img src="/images/Banku1.jpeg" alt="Banku" />
						<h4>Banku</h4>
						<p>with fried fish</p>
						<div className="rating">★★★★☆ 4.1</div>
						<p className="price">¢25</p>
					</div>
					<div className="menu-item">
						<img src="/images/kenkey.jpeg" alt="Kenkey" />
						<h4>Kenkey</h4>
						<p>with fried fish</p>
						<div className="rating">★★★★☆ 4.2</div>
						<p className="price">¢25</p>
					</div>
					<div className="menu-item">
						<img src="/images/gob3.jpeg" alt="Gob3" />
						<h4>Gob3</h4>
						<p>with fried plantain</p>
						<div className="rating">★★★★★ 4.5</div>
						<p className="price">¢45</p>
					</div>
				</div>
			</section>

			<section className="potatoes-section" id="potatoes-section">
				<h2>Best French Fries</h2>
				<p>
					Russet potatoes are ideal. Since they're dense, they don't
					contain as much water inside, which allows them to get extra
					crispy
				</p>
				<div className="fries">
					<img
						src="/images/fries.jpeg"
						alt="French Fries"
						className="fries-image"
					/>
					<img
						src="/images/fries2.jpeg"
						alt="French Fries"
						className="fries-image"
					/>
					<img
						src="/images/fries1.jpeg"
						alt="French Fries"
						className="fries-image"
					/>
				</div>
			</section>

			<section className="services">
				<h3>Our Services</h3>
				<h2>
					We provide this and many more for our cherished customers
				</h2>
				<div className="services-grid">
					<div className="service">
						<img
							src="/images/online booking.jpg"
							alt="Online Booking"
						/>
						<span>Online Booking</span>
					</div>
					<div className="service">
						<img
							src="/images/catering services.jpg"
							alt="Catering Service"
						/>
						<span>Catering Service</span>
					</div>
					<div className="service">
						<img src="/images/membership.jpg" alt="Membership" />
						<span>Membership</span>
					</div>
					<div className="service">
						<img
							src="/images/delivery.jpg"
							alt="Delivery Service"
						/>
						<span>Delivery Service</span>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Home;
