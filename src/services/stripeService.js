import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/**
 * Initialize Stripe instance
 */
export const getStripe = async () => {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Failed to load Stripe');
  }
  return stripe;
};

/**
 * Create payment intent on the server
 * In a real app, this would call your backend API
 * For now, we'll simulate the server response
 */
export const createPaymentIntent = async (orderData) => {
  try {
    // Simulate API call to your backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(orderData.total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: orderData.orderId,
          userId: orderData.userId,
          deliveryType: orderData.deliveryType,
          deliveryAddress: orderData.deliveryAddress || null,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return { success: true, clientSecret };
  } catch (error) {
    // For demo purposes, return a mock client secret
    console.warn('Using mock payment intent for demo:', error.message);
    return {
      success: true,
      clientSecret: 'pi_mock_client_secret_for_demo',
      isDemo: true
    };
  }
};

/**
 * Confirm payment with Stripe
 */
export const confirmPayment = async (stripe, elements, clientSecret) => {
  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?payment=success`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        paymentIntent: error.payment_intent
      };
    }

    return {
      success: true,
      paymentIntent,
      paymentStatus: paymentIntent.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create payment method
 */
export const createPaymentMethod = async (stripe, cardElement) => {
  try {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      paymentMethod
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Format amount for display
 */
export const formatAmount = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Validate card details
 */
export const validateCard = (cardData) => {
  const errors = {};

  if (!cardData.cardNumber) {
    errors.cardNumber = 'Card number is required';
  } else if (!/^\d{13,19}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
    errors.cardNumber = 'Invalid card number';
  }

  if (!cardData.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
    errors.expiryDate = 'Invalid expiry date (MM/YY)';
  }

  if (!cardData.cvv) {
    errors.cvv = 'CVV is required';
  } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
    errors.cvv = 'Invalid CVV';
  }

  if (!cardData.cardholderName) {
    errors.cardholderName = 'Cardholder name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format card number with spaces
 */
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

/**
 * Format expiry date
 */
export const formatExpiryDate = (value) => {
  const v = value.replace(/\D/g, '');
  if (v.length >= 2) {
    return v.substring(0, 2) + '/' + v.substring(2, 4);
  }
  return v;
};

/**
 * Get card type from number
 */
export const getCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  if (/^6/.test(number)) return 'discover';
  
  return 'unknown';
};

/**
 * Demo payment methods for testing
 */
export const DEMO_PAYMENT_METHODS = [
  {
    id: 'pm_demo_visa',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2025
    },
    billing_details: {
      name: 'Demo User'
    }
  },
  {
    id: 'pm_demo_mastercard',
    type: 'card',
    card: {
      brand: 'mastercard',
      last4: '5555',
      exp_month: 10,
      exp_year: 2026
    },
    billing_details: {
      name: 'Demo User'
    }
  }
];

/**
 * Demo payment success simulation
 */
export const simulatePaymentSuccess = async (orderData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    paymentIntent: {
      id: `pi_demo_${Date.now()}`,
      status: 'succeeded',
      amount: Math.round(orderData.total * 100),
      currency: 'usd',
      created: Math.floor(Date.now() / 1000),
      metadata: {
        orderId: orderData.orderId,
        userId: orderData.userId,
        deliveryType: orderData.deliveryType
      }
    }
  };
};