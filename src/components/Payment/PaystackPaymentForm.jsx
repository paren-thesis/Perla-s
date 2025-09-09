import React, { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { FaCreditCard, FaLock, FaCheck, FaExclamationTriangle, FaEnvelope, FaMoneyBillWave } from 'react-icons/fa';
import {
    initializePaystack,
    createPaymentData,
    formatAmount,
    validateEmail,
    validateAmount,
    getSupportedCurrencies,
    isPaystackAvailable,
    getPaystackErrorMessage,
    simulatePaymentSuccess
} from '../../services/paystackService';

const PaystackPaymentForm = ({
    orderData,
    onPaymentSuccess,
    onPaymentError,
    isProcessing = false,
    className = ""
}) => {
    const [email, setEmail] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('GHS');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPaystackReady, setIsPaystackReady] = useState(false);

    const currencies = getSupportedCurrencies();

    // Check if Paystack is available
    useEffect(() => {
        setIsPaystackReady(isPaystackAvailable());
    }, []);

    // Initialize Paystack payment
    const config = initializePaystack({
        email,
        amount: orderData.total + (orderData.deliveryFee || 0),
        currency: selectedCurrency,
        reference: `PAYSTACK_${orderData.orderId}_${Date.now()}`,
        metadata: {
            orderId: orderData.orderId,
            userId: orderData.userId,
            deliveryType: orderData.deliveryType,
            deliveryAddress: orderData.deliveryAddress || null
        },
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose
    });

    const initializePayment = usePaystackPayment(config);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Clear errors when user starts typing
        if (error) {
            setError('');
        }
    };

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    const validateForm = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!validateAmount(orderData.total)) {
            setError('Invalid order amount');
            return false;
        }

        return true;
    };

    const handlePaymentSuccess = (response) => {
        console.log('Payment successful:', response);
        setSuccess('Payment successful!');
        onPaymentSuccess(response);
    };

    const handlePaymentClose = () => {
        console.log('Payment closed');
        setError('Payment was cancelled');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!isPaystackReady) {
            setError('Paystack is not configured. Please check your API key.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // For demo purposes, simulate payment if no API key
            if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
                const result = await simulatePaymentSuccess(orderData);
                if (result.success) {
                    setSuccess('Payment successful! (Demo Mode)');
                    onPaymentSuccess(result.payment);
                } else {
                    setError('Payment failed');
                    onPaymentError('Payment failed');
                }
                return;
            }

            // Real Paystack payment
            initializePayment();
        } catch (error) {
            console.error('Payment error:', error);
            setError(getPaystackErrorMessage(error.message));
            onPaymentError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const totalAmount = orderData.total + (orderData.deliveryFee || 0);

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
                        {formatAmount(totalAmount, selectedCurrency)}
                    </span>
                </div>
                {orderData.deliveryType === 'delivery' && orderData.deliveryFee > 0 && (
                    <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span className="text-gray-700">{formatAmount(orderData.deliveryFee, selectedCurrency)}</span>
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
                {/* Email Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        We'll send your receipt to this email
                    </p>
                </div>

                {/* Currency Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaMoneyBillWave className="inline mr-2" />
                        Currency
                    </label>
                    <select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                        {currencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                                {currency.symbol} {currency.name} ({currency.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Payment Methods Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Accepted Payment Methods</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <div className="flex items-center">
                            <span className="mr-2">💳</span>
                            <span>Credit/Debit Cards</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">📱</span>
                            <span>Mobile Money</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">🏦</span>
                            <span>Bank Transfer</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">💰</span>
                            <span>Paystack Wallet</span>
                        </div>
                    </div>
                </div>

                {/* Demo Notice */}
                {!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <FaExclamationTriangle className="mr-2 mt-0.5 text-yellow-500" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">Demo Mode</p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    This is a demo payment. No real charges will be made.
                                    Add your Paystack API key to enable real payments.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isPaystackReady || isLoading || isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${!isPaystackReady || isLoading || isProcessing
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
                            Pay {formatAmount(totalAmount, selectedCurrency)}
                        </>
                    )}
                </button>
            </form>

            {/* Security Notice */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                    Powered by Paystack • Your payment information is secure and encrypted
                </p>
            </div>
        </div>
    );
};

export default PaystackPaymentForm;