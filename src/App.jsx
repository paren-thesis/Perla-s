import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApiAuthProvider } from "./contexts/ApiAuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import BookTable from "./pages/BookTable";
import AccountSettings from "./pages/AccountSettings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

function App() {
	return (
		<ApiAuthProvider>
			<Router>
				<ScrollToTop />
				<div className="app">
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/menu" element={<Menu />} />
						<Route path="/book-table" element={<BookTable />} />
						<Route path="/login" element={<Login />} />
						<Route path="/account" element={<AccountSettings />} />
					</Routes>
					<Footer />
				</div>
			</Router>
		</ApiAuthProvider>
	);
}

export default App;
