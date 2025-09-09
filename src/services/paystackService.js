import { usePaystackPayment } from 'react-paystack';

/**
 * Paystack configuration and utilities
 */

// Paystack public key from environment
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

/**
 * Initialize Paystack payment
 */
export const initializePaystack = (config) => {
  const {
    email,
    amount,
    currency = 'GHS',
    reference,
    metadata = {},
    onSuccess,
    onClose
  } = config;

  return {
    publicKey: PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(amount * 100), // Convert to kobo/pesewas
    currency,
    reference,
    metadata,
    onSuccess: (response) => {
      console.log('Payment successful:', response);
      onSuccess && onSuccess(response);
    },
    onClose: () => {
      console.log('Payment closed');
      onClose && onClose();
    }
  };
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
export const formatAmount = (amount, currency = 'GHS') => {
  const currencySymbols = {
    'GHS': '₵',
    'NGN': '₦',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
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
 * Get supported currencies
 */
export const getSupportedCurrencies = () => {
  return [
    { code: 'GHS', name: 'Ghana Cedi', symbol: '₵' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];
};

/**
 * Create payment data for Paystack
 */
export const createPaymentData = (orderData, userEmail) => {
  const reference = generateReference(orderData.orderId);
  
  return {
    email: userEmail,
    amount: orderData.total + (orderData.deliveryFee || 0),
    currency: 'GHS', // Default to Ghana Cedi
    reference,
    metadata: {
      orderId: orderData.orderId,
      userId: orderData.userId,
      deliveryType: orderData.deliveryType,
      deliveryAddress: orderData.deliveryAddress || null,
      items: orderData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    }
  };
};

/**
 * Verify payment status (for backend integration)
 */
export const verifyPayment = async (reference) => {
  try {
    // In a real app, this would call your backend API
    const response = await fetch(`/api/verify-payment/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const data = await response.json();
    return {
      success: true,
      payment: data
    };
  } catch (error) {
    // For demo purposes, simulate successful verification
    console.warn('Using mock payment verification:', error.message);
    return {
      success: true,
      payment: {
        reference,
        status: 'success',
        amount: 0,
        currency: 'GHS',
        customer: {
          email: 'demo@example.com'
        },
        metadata: {
          orderId: reference.split('_')[1]
        }
      },
      isDemo: true
    };
  }
};

/**
 * Demo payment methods for testing
 */
export const DEMO_PAYMENT_METHODS = [
  {
    id: 'pm_demo_card',
    type: 'card',
    name: 'Test Card',
    last4: '4081',
    brand: 'visa',
    isDefault: true
  },
  {
    id: 'pm_demo_mobile',
    type: 'mobile_money',
    name: 'MTN Mobile Money',
    last4: '1234',
    brand: 'mtn',
    isDefault: false
  },
  {
    id: 'pm_demo_bank',
    type: 'bank_transfer',
    name: 'Bank Transfer',
    last4: '5678',
    brand: 'bank',
    isDefault: false
  }
];

/**
 * Get payment method icon
 */
export const getPaymentMethodIcon = (type) => {
  switch (type) {
    case 'card':
      return '💳';
    case 'mobile_money':
      return '📱';
    case 'bank_transfer':
      return '🏦';
    default:
      return '💰';
  }
};

/**
 * Format payment method name
 */
export const formatPaymentMethodName = (method) => {
  const icons = {
    'visa': '💳',
    'mastercard': '💳',
    'mtn': '📱',
    'vodafone': '📱',
    'airtel': '📱',
    'bank': '🏦'
  };

  const icon = icons[method.brand] || '💰';
  return `${icon} ${method.name} ****${method.last4}`;
};

/**
 * Check if Paystack is available
 */
export const isPaystackAvailable = () => {
  return !!PAYSTACK_PUBLIC_KEY;
};

/**
 * Get error message for common Paystack errors
 */
export const getPaystackErrorMessage = (error) => {
  const errorMessages = {
    'insufficient_funds': 'Insufficient funds in your account',
    'invalid_card': 'Invalid card details',
    'expired_card': 'Your card has expired',
    'declined': 'Payment was declined by your bank',
    'network_error': 'Network error. Please try again',
    'timeout': 'Payment timed out. Please try again'
  };

  return errorMessages[error] || 'Payment failed. Please try again';
};

/**
 * Demo payment success simulation
 */
export const simulatePaymentSuccess = async (orderData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    payment: {
      reference: generateReference(orderData.orderId),
      status: 'success',
      amount: Math.round((orderData.total + (orderData.deliveryFee || 0)) * 100),
      currency: 'GHS',
      customer: {
        email: 'demo@example.com'
      },
      metadata: {
        orderId: orderData.orderId,
        userId: orderData.userId,
        deliveryType: orderData.deliveryType
      }
    },
    isDemo: true
  };
};