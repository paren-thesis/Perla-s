import React from "react";
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUsers, FaUser, FaPhone, FaEnvelope, FaPrint, FaHome, FaPlus } from "react-icons/fa";

const BookingConfirmation = ({ bookingData, onNewBooking, onBackToHome }) => {
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (timeString) => {
		const [hours, minutes] = timeString.split(":");
		const date = new Date();
		date.setHours(parseInt(hours), parseInt(minutes));
		return date.toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="max-w-2xl mx-auto">
			{/* Success Header */}
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
					<FaCheckCircle className="w-10 h-10 text-green-500" />
				</div>
				<h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
					Reservation Confirmed!
				</h1>
				<p className="text-lg text-gray-600">
					Thank you for choosing Perla's Restaurant. We look forward to serving you!
				</p>
			</div>

			{/* Booking Details Card */}
			<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
				<div className="border-b border-gray-200 pb-4 mb-6">
					<h2 className="text-xl font-semibold text-secondary-900 mb-2">
						Booking Details
					</h2>
					<p className="text-sm text-gray-500">
						Booking ID: <span className="font-mono font-semibold">{bookingData.bookingId}</span>
					</p>
				</div>

				<div className="space-y-4">
					{/* Date and Time */}
					<div className="grid md:grid-cols-2 gap-4">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
								<FaCalendarAlt className="text-primary-600" />
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500">Date</p>
								<p className="font-semibold text-gray-900">
									{formatDate(bookingData.date)}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
								<FaClock className="text-primary-600" />
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500">Time</p>
								<p className="font-semibold text-gray-900">
									{formatTime(bookingData.time)}
								</p>
							</div>
						</div>
					</div>

					{/* Guests */}
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
							<FaUsers className="text-primary-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">Number of Guests</p>
							<p className="font-semibold text-gray-900">
								{bookingData.guests} {bookingData.guests === 1 ? "Guest" : "Guests"}
							</p>
						</div>
					</div>

					{/* Contact Information */}
					<div className="grid md:grid-cols-2 gap-4">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
								<FaUser className="text-primary-600" />
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500">Name</p>
								<p className="font-semibold text-gray-900">{bookingData.name}</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
								<FaPhone className="text-primary-600" />
							</div>
							<div>
								<p className="text-sm font-medium text-gray-500">Phone</p>
								<p className="font-semibold text-gray-900">{bookingData.phone}</p>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
							<FaEnvelope className="text-primary-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500">Email</p>
							<p className="font-semibold text-gray-900">{bookingData.email}</p>
						</div>
					</div>

					{/* Special Requests */}
					{bookingData.specialRequests && (
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm font-medium text-gray-500 mb-1">Special Requests</p>
							<p className="text-gray-900">{bookingData.specialRequests}</p>
						</div>
					)}
				</div>
			</div>

			{/* Important Information */}
			<div className="bg-primary-50 rounded-xl p-6 mb-8">
				<h3 className="font-semibold text-primary-900 mb-3">Important Information</h3>
				<ul className="space-y-2 text-sm text-primary-800">
					<li>• Please arrive 10 minutes before your reservation time</li>
					<li>• Tables are held for 15 minutes past the reservation time</li>
					<li>• Free cancellation up to 2 hours before your reservation</li>
					<li>• For parties of 6 or more, a 18% service charge will be added</li>
					<li>• Contact us at (555) 123-4567 for any changes or questions</li>
				</ul>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row gap-4">
				<button
					onClick={handlePrint}
					className="flex-1 flex items-center justify-center px-6 py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
				>
					<FaPrint className="mr-2" />
					Print Confirmation
				</button>
				
				<button
					onClick={onNewBooking}
					className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
				>
					<FaPlus className="mr-2" />
					Make Another Booking
				</button>
				
				<button
					onClick={onBackToHome}
					className="flex-1 flex items-center justify-center px-6 py-3 bg-secondary-600 text-white rounded-lg font-semibold hover:bg-secondary-700 transition-colors duration-200"
				>
					<FaHome className="mr-2" />
					Back to Home
				</button>
			</div>

			{/* Email Confirmation Notice */}
			<div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-800">
					📧 A confirmation email has been sent to <strong>{bookingData.email}</strong>
				</p>
			</div>
		</div>
	);
};

export default BookingConfirmation;