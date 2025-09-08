import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FaCreditCard, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { 
  createPaymentIntent, 
  confirmPayment, 
  formatAmount,
  validateCard,
  formatCardNumber,
  formatExpiryDate,
  getCardType,
  simulatePaymentSuccess
} from '../../services/stripeService';

const PaymentForm = ({ 
  orderData, 
  onPaymentSuccess, 
  onPaymentError,
  isProcessing = false,
  className = ""
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [clientSecret, setClientSecret] = useState('');

  // Create payment intent when component mounts
  useEffect(() => {
    const initializePayment = async () => {
      try {
        const result = await createPaymentIntent(orderData);
        if (result.success) {
          setClientSecret(result.clientSecret);
        } else {
          setError('Failed to initialize payment');
        }
      } catch (error) {
        setError('Payment initialization failed');
        console.error('Payment init error:', error);
      }
    };

    initializePayment();
  }, [orderData]);

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear errors when user starts typing
    if (cardErrors[field]) {
      setCardErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const validation = validateCard(cardData);
    setCardErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // For demo purposes, simulate payment
      if (clientSecret === 'pi_mock_client_secret_for_demo') {
        const result = await simulatePaymentSuccess(orderData);
        if (result.success) {
          setSuccess('Payment successful!');
          onPaymentSuccess(result.paymentIntent);
        } else {
          setError('Payment failed');
          onPaymentError('Payment failed');
        }
        return;
      }

      // Real Stripe payment
      const cardElement = elements.getElement(CardElement);
      const result = await confirmPayment(stripe, elements, clientSecret);

      if (result.success) {
        setSuccess('Payment successful!');
        onPaymentSuccess(result.paymentIntent);
      } else {
        setError(result.error || 'Payment failed');
        onPaymentError(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An unexpected error occurred');
      onPaymentError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const cardType = getCardType(cardData.cardNumber);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaCreditCard className="mr-2 text-primary-500" />
          Payment Information
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <FaLock className="mr-1" />
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Order Total</span>
          <span className="text-xl font-bold text-gray-900">
            {formatAmount(orderData.total)}
          </span>
        </div>
        {orderData.deliveryType === 'delivery' && orderData.deliveryFee > 0 && (
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-500">Delivery Fee</span>
            <span className="text-gray-700">{formatAmount(orderData.deliveryFee)}</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <FaExclamationTriangle className="mr-2 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-start">
          <FaCheck className="mr-2 mt-0.5 text-green-500" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="John Doe"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
              cardErrors.cardholderName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {cardErrors.cardholderName && (
            <p className="text-red-500 text-sm mt-1">{cardErrors.cardholderName}</p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors pr-12 ${
                cardErrors.cardNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {cardType !== 'unknown' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className={`w-8 h-5 rounded border ${
                  cardType === 'visa' ? 'bg-blue-600' :
                  cardType === 'mastercard' ? 'bg-red-600' :
                  cardType === 'amex' ? 'bg-green-600' :
                  'bg-gray-400'
                }`}></div>
              </div>
            )}
          </div>
          {cardErrors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{cardErrors.cardNumber}</p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={cardData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                cardErrors.expiryDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {cardErrors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{cardErrors.expiryDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              value={cardData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder="123"
              maxLength={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                cardErrors.cvv ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {cardErrors.cvv && (
              <p className="text-red-500 text-sm mt-1">{cardErrors.cvv}</p>
            )}
          </div>
        </div>

        {/* Stripe Card Element (for real payments) */}
        {clientSecret && clientSecret !== 'pi_mock_client_secret_for_demo' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="p-4 border border-gray-300 rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Demo Notice */}
        {clientSecret === 'pi_mock_client_secret_for_demo' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <FaExclamationTriangle className="mr-2 mt-0.5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Demo Mode</p>
                <p className="text-xs text-yellow-700 mt-1">
                  This is a demo payment. No real charges will be made. 
                  Use any card details to test the flow.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading || isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
            !stripe || isLoading || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isLoading || isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <FaLock className="mr-2" />
              Pay {formatAmount(orderData.total)}
            </>
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;