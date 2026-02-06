/**
 * Modern Paystack Transactions API Service
 * Uses the official Paystack API endpoints for payment processing
 */

// Paystack configuration from environment
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SECRET_KEY = import.meta.env.VITE_PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const USE_BACKEND_PROXY = import.meta.env.VITE_USE_BACKEND_PROXY === 'true';

// ⚠️ SECURITY WARNING: In production, API calls should go through your backend
// This implementation supports both direct API calls (dev/test) and backend proxy (production)
// Set VITE_USE_BACKEND_PROXY=true and VITE_BACKEND_URL to use backend proxy
// Never expose secret keys in production frontend code

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

	// Live mode warning
	if (isLiveMode()) {
		console.warn('🚨 LIVE MODE: Real money transaction will be processed!');
	}

	try {
		// Use backend proxy if configured, otherwise direct API call
		const apiUrl = USE_BACKEND_PROXY && BACKEND_URL 
			? `${BACKEND_URL}/api/paystack/initialize`
			: `${PAYSTACK_BASE_URL}/transaction/initialize`;
		
		const headers = USE_BACKEND_PROXY && BACKEND_URL
			? { 'Content-Type': 'application/json' }
			: {
				'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
				'Content-Type': 'application/json'
			};

		const requestBody = {
			email,
			amount: Math.round(amount * 100).toString(), // Convert to pesewas and stringify
			currency,
			reference,
			channels,
			metadata: USE_BACKEND_PROXY ? metadata : JSON.stringify(metadata)
		};

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers,
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || errorData.error || 'Failed to initialize transaction');
		}

		const data = await response.json();
		console.log(`PayStack ${getCurrentMode().toUpperCase()} transaction initialized:`, {
			reference,
			amount: amount,
			currency,
			channels,
			usingProxy: USE_BACKEND_PROXY && BACKEND_URL
		});
		
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
		// Use backend proxy if configured, otherwise direct API call
		const apiUrl = USE_BACKEND_PROXY && BACKEND_URL 
			? `${BACKEND_URL}/api/paystack/verify/${reference}`
			: `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`;
		
		const headers = USE_BACKEND_PROXY && BACKEND_URL
			? {}
			: { 'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}` };

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || errorData.error || 'Failed to verify transaction');
		}

		const data = await response.json();
		
		// Log verification result
		console.log(`PayStack ${getCurrentMode().toUpperCase()} transaction verified:`, {
			reference,
			status: data.data.status,
			amount: data.data.amount / 100, // Convert back from pesewas
			currency: data.data.currency,
			channel: data.data.channel,
			usingProxy: USE_BACKEND_PROXY && BACKEND_URL
		});
		
		if (isLiveMode() && data.data.status === 'success') {
			console.log('💰 LIVE PAYMENT SUCCESSFUL - Real money received!');
		}
		
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
	// Available if we have secret key OR backend proxy configured
	return !!PAYSTACK_SECRET_KEY || (USE_BACKEND_PROXY && !!BACKEND_URL);
};

/**
 * Check if we're in live mode
 */
export const isLiveMode = () => {
	// Priority 1: Environment variable mode
	if (import.meta.env.VITE_PAYSTACK_MODE === 'live') return true;
	
	// Priority 2: Backend proxy mode (if no explicit env mode)
	if (USE_BACKEND_PROXY && BACKEND_URL) {
		return import.meta.env.VITE_PAYSTACK_MODE === 'live';
	}
	
	// Priority 3: Secret key prefix
	return PAYSTACK_SECRET_KEY?.startsWith('sk_live_');
};

/**
 * Check if we're in test mode
 */
export const isTestMode = () => {
	// Priority 1: Environment variable mode
	if (import.meta.env.VITE_PAYSTACK_MODE === 'test') return true;

	// Priority 2: Backend proxy mode
	if (USE_BACKEND_PROXY && BACKEND_URL) {
		return import.meta.env.VITE_PAYSTACK_MODE === 'test';
	}
	
	// Priority 3: Secret key prefix
	return PAYSTACK_SECRET_KEY?.startsWith('sk_test_');
};

/**
 * Get current mode (live, test, or demo)
 */
export const getCurrentMode = () => {
	// Explicit environment mode takes absolute priority
	const envMode = import.meta.env.VITE_PAYSTACK_MODE;
	if (envMode === 'live') return 'live';
	if (envMode === 'test') return 'test';

	// If no explicit mode, fall back to detection
	if (!PAYSTACK_SECRET_KEY && !USE_BACKEND_PROXY) return 'demo';
	if (isLiveMode()) return 'live';
	if (isTestMode()) return 'test';
	
	return 'demo';
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
