import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BookingForm from "../components/Booking/BookingForm";
import BookingConfirmation from "../components/Booking/BookingConfirmation";
import LoginRequiredDialog from "../components/Menu/LoginRequiredDialog";

function BookTable() {
	const [isVisible, setIsVisible] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [bookingData, setBookingData] = useState(null);
	const [showLoginDialog, setShowLoginDialog] = useState(false);
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const handleBookingSubmit = (formData) => {
		if (!currentUser) {
			setShowLoginDialog(true);
			return;
		}

		// Add user info to booking data
		const completeBookingData = {
			...formData,
			userEmail: currentUser.email,
			userId: currentUser.uid,
			bookingId: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
			status: "confirmed",
			createdAt: new Date().toISOString(),
		};

		setBookingData(completeBookingData);
		setShowConfirmation(true);

		// Here you would typically save to a database
		console.log("Booking submitted:", completeBookingData);
	};

	const handleNewBooking = () => {
		setShowConfirmation(false);
		setBookingData(null);
	};

	const handleLoginRedirect = () => {
		setShowLoginDialog(false);
		navigate("/login", {
			state: {
				from: "booking",
				returnTo: "/book-table",
			},
		});
	};

	const closeLoginDialog = () => {
		setShowLoginDialog(false);
	};

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-24 md:pt-28 pb-12 transition-all duration-700 ease-out ${
				isVisible ? "opacity-100" : "opacity-0"
			}`}
		>
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{!showConfirmation ? (
					<>
						{/* Header */}
						<div className="text-center mb-12">
							<h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
								Book Your Table
							</h1>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto">
								Reserve your spot at Perla's Restaurant. Experience our
								delicious continental dishes in a warm and welcoming
								atmosphere.
							</p>
						</div>

						{/* Booking Form */}
						<BookingForm onSubmit={handleBookingSubmit} />
					</>
				) : (
					<BookingConfirmation
						bookingData={bookingData}
						onNewBooking={handleNewBooking}
						onBackToHome={() => navigate("/")}
					/>
				)}
			</div>

			{/* Login Required Dialog */}
			<LoginRequiredDialog
				isOpen={showLoginDialog}
				onClose={closeLoginDialog}
				onLoginRedirect={handleLoginRedirect}
			/>
		</div>
	);
}

export default BookTable;