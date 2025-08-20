import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// For demo purposes - replace with actual authentication
		if (username === "User1" && password === "password") {
			navigate("/menu");
		} else {
			setError("Invalid username or password. Please try again.");
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="login-container">
			<h1 className="login-title">Login</h1>
			<form className="login-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Enter your username"
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<div className="password-wrapper">
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
						/>
						<div
							className={`toggle-password-dot ${
								showPassword ? "show" : ""
							}`}
							onClick={togglePasswordVisibility}
						/>
					</div>
				</div>
				<button type="submit" className="login-button">
					Login
				</button>
				<p className="signup-text">
					Don't have an account? <a href="#">Sign up</a>
				</p>
				{error && <p className="error-message">{error}</p>}
			</form>
		</div>
	);
}

export default Login;
