import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaUser, FaPhone, FaEnvelope, FaStickyNote } from "react-icons/fa";

const BookingForm = ({ onSubmit }) => {
	const [formData, setFormData] = useState({
		date: "",
		time: "",
		guests: 2,
		name: "",
		phone: "",
		email: "",
		specialRequests: "",
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Generate time slots
	const generateTimeSlots = () => {
		const slots = [];
		for (let hour = 11; hour <= 22; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const timeString = `${hour.toString().padStart(2, "0")}:${minute
					.toString()
					.padStart(2, "0")}`;
				const displayTime = new Date(`2000-01-01 ${timeString}`).toLocaleTimeString(
					[],
					{ hour: "numeric", minute: "2-digit", hour12: true }
				);
				slots.push({ value: timeString, label: displayTime });
			}
		}
		return slots;
	};

	const timeSlots = generateTimeSlots();

	// Get minimum date (today)
	const getMinDate = () => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	// Get maximum date (3 months from now)
	const getMaxDate = () => {
		const maxDate = new Date();
		maxDate.setMonth(maxDate.getMonth() + 3);
		return maxDate.toISOString().split("T")[0];
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.date) newErrors.date = "Date is required";
		if (!formData.time) newErrors.time = "Time is required";
		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
		else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
			newErrors.phone = "Please enter a valid phone number";
		}
		if (!formData.email.trim()) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (formData.guests < 1 || formData.guests > 20) {
			newErrors.guests = "Number of guests must be between 1 and 20";
		}

		// Check if selected date is not in the past
		const selectedDate = new Date(formData.date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (selectedDate < today) {
			newErrors.date = "Please select a future date";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) return;

		setIsSubmitting(true);
		
		try {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			onSubmit(formData);
		} catch (error) {
			console.error("Booking submission error:", error);
			setErrors({ submit: "Failed to submit booking. Please try again." });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
			{errors.submit && (
				<div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
					{errors.submit}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Date and Time Row */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Date Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<FaCalendarAlt className="inline mr-2 text-primary-500" />
							Select Date
						</label>
						<input
							type="date"
							name="date"
							value={formData.date}
							onChange={handleInputChange}
							min={getMinDate()}
							max={getMaxDate()}
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
								errors.date ? "border-red-300" : "border-gray-300"
							}`}
						/>
						{errors.date && (
							<p className="text-red-500 text-sm mt-1">{errors.date}</p>
						)}
					</div>

					{/* Time Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<FaClock className="inline mr-2 text-primary-500" />
							Select Time
						</label>
						<select
							name="time"
							value={formData.time}
							onChange={handleInputChange}
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
								errors.time ? "border-red-300" : "border-gray-300"
							}`}
						>
							<option value="">Choose a time</option>
							{timeSlots.map((slot) => (
								<option key={slot.value} value={slot.value}>
									{slot.label}
								</option>
							))}
						</select>
						{errors.time && (
							<p className="text-red-500 text-sm mt-1">{errors.time}</p>
						)}
					</div>
				</div>

				{/* Number of Guests */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						<FaUsers className="inline mr-2 text-primary-500" />
						Number of Guests
					</label>
					<select
						name="guests"
						value={formData.guests}
						onChange={handleInputChange}
						className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
							errors.guests ? "border-red-300" : "border-gray-300"
						}`}
					>
						{Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
							<option key={num} value={num}>
								{num} {num === 1 ? "Guest" : "Guests"}
							</option>
						))}
					</select>
					{errors.guests && (
						<p className="text-red-500 text-sm mt-1">{errors.guests}</p>
					)}
				</div>

				{/* Contact Information */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Full Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<FaUser className="inline mr-2 text-primary-500" />
							Full Name
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							placeholder="Enter your full name"
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
								errors.name ? "border-red-300" : "border-gray-300"
							}`}
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1">{errors.name}</p>
						)}
					</div>

					{/* Phone Number */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							<FaPhone className="inline mr-2 text-primary-500" />
							Phone Number
						</label>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleInputChange}
							placeholder="Enter your phone number"
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
								errors.phone ? "border-red-300" : "border-gray-300"
							}`}
						/>
						{errors.phone && (
							<p className="text-red-500 text-sm mt-1">{errors.phone}</p>
						)}
					</div>
				</div>

				{/* Email */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						<FaEnvelope className="inline mr-2 text-primary-500" />
						Email Address
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						placeholder="Enter your email address"
						className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
							errors.email ? "border-red-300" : "border-gray-300"
						}`}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email}</p>
					)}
				</div>

				{/* Special Requests */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						<FaStickyNote className="inline mr-2 text-primary-500" />
						Special Requests (Optional)
					</label>
					<textarea
						name="specialRequests"
						value={formData.specialRequests}
						onChange={handleInputChange}
						placeholder="Any special requests, dietary restrictions, or celebration details..."
						rows={4}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isSubmitting}
					className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:-translate-y-0.5 ${
						isSubmitting
							? "bg-gray-400 cursor-not-allowed"
							: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl"
					}`}
				>
					{isSubmitting ? (
						<div className="flex items-center justify-center">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							Processing Booking...
						</div>
					) : (
						"Confirm Reservation"
					)}
				</button>
			</form>

			{/* Restaurant Info */}
			<div className="mt-8 pt-6 border-t border-gray-200">
				<div className="grid md:grid-cols-3 gap-4 text-center">
					<div>
						<h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
						<p className="text-sm text-gray-600">11:00 AM - 10:00 PM</p>
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 mb-1">Contact</h4>
						<p className="text-sm text-gray-600">(555) 123-4567</p>
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 mb-1">Cancellation</h4>
						<p className="text-sm text-gray-600">Free up to 2 hours before</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingForm;