import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import "./App.css";

function App() {
	return (
		<Router>
			<div className="app">
				<nav className="navbar">
					<div className="nav-content">
						<div className="nav-brand">
							Perla<span>'s</span>
						</div>
						<ul className="nav-links">
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/about">About Us</Link>
							</li>
							<li>
								<Link to="/menu">Menu</Link>
							</li>
							<li>
								<Link to="/login">Login</Link>
							</li>
						</ul>
						<img
							src="/images/hamburger.png"
							alt="Menu"
							className="hamburger"
						/>
					</div>
				</nav>

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/menu" element={<Menu />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
