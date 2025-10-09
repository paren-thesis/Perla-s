/**
 * Modern Paystack Transactions API Service
 * Uses the official Paystack API endpoints for payment processing
 */

// Paystack configuration from environment
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SECRET_KEY = import.meta.env.VITE_PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Important: In production, API calls should go through your backend
// This is for demonstration purposes only
// Never expose your secret key in frontend code

/**
 * Initialize Transaction using Paystack Transactions API
 * @param {Object} config - Payment configuration
 * @returns {Promise} - API response
 */
export const initializeTransaction = async (config) => {
	const {
		email,
		amount,
		currency = "GHS",
		reference,
		metadata = {},
		channels = ["mobile_money"], // Default to mobile money for Ghana
	} = config;

	try {
		const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				amount: Math.round(amount * 100).toString(), // Convert to pesewas and stringify
				currency,
				reference,
				channels,
				metadata: JSON.stringify(metadata)
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to initialize transaction');
		}

		const data = await response.json();
		return {
			success: true,
			data: data.data,
			message: data.message
		};
	} catch (error) {
		console.error('Initialize transaction error:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

/**
 * Generate unique reference for payment
 */
export const generateReference = (orderId) => {
	return `PAYSTACK_${orderId}_${Date.now()}`;
};

/**
 * Format amount for display
 */
export const formatAmount = (amount, currency = "GHS") => {
	const currencySymbols = {
		GHS: "₵",
		NGN: "₦",
		USD: "$",
		EUR: "€",
		GBP: "£",
	};

	const symbol = currencySymbols[currency] || currency;
	return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validate amount
 */
export const validateAmount = (amount) => {
	return amount > 0 && !isNaN(amount);
};

/**
 * Get supported currencies (Ghana Cedis only as per requirements)
 */
export const getSupportedCurrencies = () => {
	return [
		{ code: "GHS", name: "Ghana Cedi", symbol: "₵" }
	];
};

/**
 * Get supported payment channels for Ghana
 */
export const getSupportedChannels = () => {
	return [
		{ code: "mobile_money", name: "Mobile Money", icon: "📱" },
		{ code: "card", name: "Credit/Debit Card", icon: "💳" },
		{ code: "bank_transfer", name: "Bank Transfer", icon: "🏦" },
		{ code: "ussd", name: "USSD", icon: "📞" }
	];
};

/**
 * Create payment data for Paystack Transactions API
 */
export const createPaymentData = (orderData, userEmail, channels = ["mobile_money"]) => {
	const reference = generateReference(orderData.orderId);

	return {
		email: userEmail,
		amount: orderData.total + (orderData.deliveryFee || 0),
		currency: "GHS", // Ghana Cedis only
		reference,
		channels, // Payment methods to allow
		metadata: {
			orderId: orderData.orderId,
			userId: orderData.userId,
			deliveryType: orderData.deliveryType,
			deliveryAddress: orderData.deliveryAddress || null,
			items: orderData.items.map((item) => ({
				name: item.name,
				quantity: item.quantity,
				price: item.price,
			})),
			customer_name: orderData.customerName || '',
			customer_phone: orderData.customerPhone || ''
		},
	};
};

/**
 * Verify Transaction using Paystack Transactions API
 * @param {string} reference - Transaction reference
 * @returns {Promise} - Verification result
 */
export const verifyTransaction = async (reference) => {
	try {
		const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to verify transaction');
		}

		const data = await response.json();
		return {
			success: true,
			data: data.data,
			message: data.message
		};
	} catch (error) {
		console.error('Verify transaction error:', error);
		// For demo purposes when API key is not available
		if (!PAYSTACK_SECRET_KEY) {
			console.warn("Using mock payment verification - no API key provided");
			return {
				success: true,
				data: {
					reference,
					status: "success",
					amount: 0,
					currency: "GHS",
					customer: {
						email: "demo@example.com",
					},
					metadata: {
						orderId: reference.split("_")[1],
					},
				},
				isDemo: true,
				message: "Demo verification successful"
			};
		}
		return {
			success: false,
			error: error.message
		};
	}
};

/**
 * Demo payment methods for testing (Ghana-focused)
 */
export const DEMO_PAYMENT_METHODS = [
	{
		id: "pm_demo_mtn",
		type: "mobile_money",
		name: "MTN Mobile Money",
		last4: "1234",
		brand: "mtn",
		isDefault: true,
	},
	{
		id: "pm_demo_vodafone",
		type: "mobile_money",
		name: "Vodafone Cash",
		last4: "5678",
		brand: "vodafone",
		isDefault: false,
	},
	{
		id: "pm_demo_airteltigo",
		type: "mobile_money",
		name: "AirtelTigo Money",
		last4: "9012",
		brand: "airteltigo",
		isDefault: false,
	},
];

/**
 * Get payment method icon
 */
export const getPaymentMethodIcon = (type) => {
	switch (type) {
		case "card":
			return "💳";
		case "mobile_money":
			return "📱";
		case "bank_transfer":
			return "🏦";
		default:
			return "💰";
	}
};

/**
 * Format payment method name
 */
export const formatPaymentMethodName = (method) => {
	const icons = {
		mtn: "📱",
		vodafone: "📱",
		airteltigo: "📱",
		bank: "🏦",
		card: "💳",
		visa: "💳",
		mastercard: "💳"
	};

	const icon = icons[method.brand] || "💰";
	return `${icon} ${method.name} ****${method.last4}`;
};

/**
 * Check if Paystack is available
 */
export const isPaystackAvailable = () => {
	return !!PAYSTACK_SECRET_KEY;
};

/**
 * Open Paystack popup for payment
 * @param {string} authorizationUrl - Authorization URL from initialize transaction
 * @param {Function} onSuccess - Success callback
 * @param {Function} onClose - Close callback
 */
export const openPaystackPopup = (authorizationUrl, onSuccess, onClose) => {
	const popup = window.open(
		authorizationUrl,
		'paystack_popup',
		'width=500,height=600,scrollbars=yes,resizable=yes'
	);

	// Poll for popup closure
	const checkClosed = setInterval(() => {
		if (popup.closed) {
			clearInterval(checkClosed);
			onClose && onClose();
		}
	}, 1000);

	// Listen for messages from popup
	const messageListener = (event) => {
		if (event.origin !== window.location.origin) return;
		
		if (event.data.type === 'PAYSTACK_SUCCESS') {
			clearInterval(checkClosed);
			popup.close();
			window.removeEventListener('message', messageListener);
			onSuccess && onSuccess(event.data.reference);
		} else if (event.data.type === 'PAYSTACK_CLOSE') {
			clearInterval(checkClosed);
			popup.close();
			window.removeEventListener('message', messageListener);
			onClose && onClose();
		}
	};

	window.addEventListener('message', messageListener);
	return popup;
};

/**
 * Get error message for common Paystack errors
 */
export const getPaystackErrorMessage = (error) => {
	const errorMessages = {
		insufficient_funds: "Insufficient funds in your mobile money account",
		invalid_phone: "Invalid mobile money number",
		network_error: "Network error. Please check your connection",
		timeout: "Payment timed out. Please try again",
		declined: "Payment was declined",
		cancelled: "Payment was cancelled",
		failed: "Payment failed. Please try again",
		'Invalid authorization code': "Invalid payment authorization",
		'Transaction not found': "Transaction could not be found"
	};

	return errorMessages[error] || "Payment failed. Please try again";
};

/**
 * List transactions using Paystack API
 * @param {Object} params - Query parameters
 * @returns {Promise} - API response
 */
export const listTransactions = async (params = {}) => {
	try {
		const queryParams = new URLSearchParams({
			perPage: params.perPage || 50,
			page: params.page || 1,
			...params
		});

		const response = await fetch(`${PAYSTACK_BASE_URL}/transaction?${queryParams}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to fetch transactions');
		}

		const data = await response.json();
		return {
			success: true,
			data: data.data,
			meta: data.meta
		};
	} catch (error) {
		console.error('List transactions error:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

/**
 * Fetch single transaction
 * @param {string|number} id - Transaction ID
 * @returns {Promise} - API response
 */
export const fetchTransaction = async (id) => {
	try {
		const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/${id}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to fetch transaction');
		}

		const data = await response.json();
		return {
			success: true,
			data: data.data
		};
	} catch (error) {
		console.error('Fetch transaction error:', error);
		return {
			success: false,
			error: error.message
		};
	}
};

/**
 * Demo payment success simulation
 */
export const simulatePaymentSuccess = async (orderData) => {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 2000));

	return {
		success: true,
		data: {
			reference: generateReference(orderData.orderId),
			status: "success",
			amount: Math.round(
				(orderData.total + (orderData.deliveryFee || 0)) * 100
			),
			currency: "GHS",
			customer: {
				email: "demo@example.com",
			},
			metadata: {
				orderId: orderData.orderId,
				userId: orderData.userId,
				deliveryType: orderData.deliveryType,
			},
			channel: "mobile_money",
			authorization: {
				authorization_code: "AUTH_demo123",
				card_type: null,
				last4: null,
				exp_month: null,
				exp_year: null,
				bin: null,
				bank: "MTN Mobile Money",
				channel: "mobile_money",
				signature: "SIG_demo",
				reusable: true,
				country_code: "GH"
			}
		},
		isDemo: true,
		message: "Demo payment successful"
	};
};
