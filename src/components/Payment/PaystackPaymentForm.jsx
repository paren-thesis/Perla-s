import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaLock, FaCheck, FaExclamationTriangle, FaEnvelope, FaMobile } from 'react-icons/fa';
import {
    initializeTransaction,
    verifyTransaction,
    createPaymentData,
    formatAmount,
    validateEmail,
    validateAmount,
    getSupportedCurrencies,
    getSupportedChannels,
    isPaystackAvailable,
    getPaystackErrorMessage,
    simulatePaymentSuccess,
    openPaystackPopup,
    getCurrentMode,
    isLiveMode,
    isTestMode
} from '../../services/paystackService';

const PaystackPaymentForm = ({
    orderData,
    onPaymentSuccess,
    onPaymentError,
    isProcessing = false,
    className = ""
}) => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('mobile_money');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPaystackReady, setIsPaystackReady] = useState(false);
    const [transactionRef, setTransactionRef] = useState(null);
    const [currentMode, setCurrentMode] = useState('demo');

    const currencies = getSupportedCurrencies();
    const channels = getSupportedChannels();

    // Check if Paystack is available and get current mode
    useEffect(() => {
        setIsPaystackReady(isPaystackAvailable());
        setCurrentMode(getCurrentMode());
        
        // Log current mode for debugging
        console.log('PayStack Mode:', getCurrentMode().toUpperCase());
        
        if (isLiveMode()) {
            console.warn('🚨 LIVE MODE ACTIVE - Real money transactions enabled!');
        }
    }, []);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Clear errors when user starts typing
        if (error) {
            setError('');
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);

        // Clear errors when user starts typing
        if (error) {
            setError('');
        }
    };

    const handleChannelChange = (e) => {
        setSelectedChannel(e.target.value);
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

        if (selectedChannel === 'mobile_money' && !phoneNumber) {
            setError('Phone number is required for Mobile Money');
            return false;
        }

        if (selectedChannel === 'mobile_money' && phoneNumber && !phoneNumber.match(/^\+?233[0-9]{9}$/)) {
            setError('Please enter a valid Ghana phone number (e.g., +233241234567)');
            return false;
        }

        if (!validateAmount(orderData.total)) {
            setError('Invalid order amount');
            return false;
        }

        return true;
    };

    const handlePaymentSuccess = async (reference) => {
        console.log('Payment successful, verifying:', reference);
        setIsLoading(true);
        
        try {
            // Verify the transaction
            const verification = await verifyTransaction(reference);
            
            if (verification.success && verification.data.status === 'success') {
                setSuccess('Payment verified successfully!');
                onPaymentSuccess(verification.data);
            } else {
                setError('Payment verification failed. Please contact support.');
                onPaymentError('Payment verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setError('Failed to verify payment. Please contact support.');
            onPaymentError('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentClose = () => {
        console.log('Payment popup closed');
        setError('Payment was cancelled or popup was closed');
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
            if (currentMode === 'demo') {
                const result = await simulatePaymentSuccess(orderData);
                if (result.success) {
                    setSuccess('Payment successful! (Demo Mode)');
                    onPaymentSuccess(result.data);
                } else {
                    setError('Payment failed');
                    onPaymentError('Payment failed');
                }
                return;
            }
            
            // Live mode confirmation
            if (currentMode === 'live') {
                const confirmed = window.confirm(
                    `🚨 LIVE PAYMENT CONFIRMATION\n\n` +
                    `Amount: ₵${totalAmount.toFixed(2)}\n` +
                    `Phone: ${phoneNumber}\n` +
                    `Email: ${email}\n\n` +
                    `This will charge REAL MONEY from the customer's mobile money account.\n\n` +
                    `Are you absolutely sure you want to proceed?`
                );
                
                if (!confirmed) {
                    setError('Payment cancelled by user');
                    return;
                }
            }

            // Create payment data
            const paymentData = createPaymentData(
                orderData, 
                email, 
                [selectedChannel]
            );

            // Add phone number for mobile money
            if (selectedChannel === 'mobile_money') {
                paymentData.metadata.customer_phone = phoneNumber;
            }

            // Initialize transaction
            const initResult = await initializeTransaction(paymentData);
            
            if (!initResult.success) {
                throw new Error(initResult.error);
            }

            const { authorization_url, reference } = initResult.data;
            setTransactionRef(reference);

            // Open Paystack popup
            openPaystackPopup(
                authorization_url,
                handlePaymentSuccess,
                handlePaymentClose
            );

        } catch (error) {
            console.error('Payment initialization error:', error);
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
                <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        currentMode === 'live' ? 'bg-red-100 text-red-800' :
                        currentMode === 'test' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {currentMode.toUpperCase()} MODE
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <FaLock className="mr-1" />
                        <span>Secure Payment</span>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Total</span>
                    <span className="text-xl font-bold text-gray-900">
                        {formatAmount(totalAmount, 'GHS')}
                    </span>
                </div>
                {orderData.deliveryType === 'delivery' && orderData.deliveryFee > 0 && (
                    <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span className="text-gray-700">{formatAmount(orderData.deliveryFee, 'GHS')}</span>
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

                {/* Phone Number for Mobile Money */}
                {selectedChannel === 'mobile_money' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaMobile className="inline mr-2" />
                            Mobile Money Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="+233241234567"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            required={selectedChannel === 'mobile_money'}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter your Ghana mobile money number
                        </p>
                    </div>
                )}

                {/* Payment Channel Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCreditCard className="inline mr-2" />
                        Payment Method
                    </label>
                    <select
                        value={selectedChannel}
                        onChange={handleChannelChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                        {channels.map((channel) => (
                            <option key={channel.code} value={channel.code}>
                                {channel.icon} {channel.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Mobile Money is the preferred payment method in Ghana
                    </p>
                </div>

                {/* Payment Methods Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Ghana Mobile Money Providers</h4>
                    <div className="grid grid-cols-1 gap-2 text-xs text-blue-800">
                        <div className="flex items-center">
                            <span className="mr-2">📱</span>
                            <span>MTN Mobile Money • Vodafone Cash • AirtelTigo Money</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">💳</span>
                            <span>Credit/Debit Cards (Visa, Mastercard)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">🏦</span>
                            <span>Bank Transfer • USSD</span>
                        </div>
                    </div>
                </div>

                {/* Mode-specific notices */}
                {currentMode === 'demo' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <FaExclamationTriangle className="mr-2 mt-0.5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Demo Mode</p>
                                <p className="text-xs text-gray-700 mt-1">
                                    This is a demo payment. No real charges will be made.
                                    Add your PayStack API keys to enable real payments.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                {currentMode === 'test' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <FaExclamationTriangle className="mr-2 mt-0.5 text-yellow-500" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">Test Mode</p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Using PayStack sandbox. Test transactions only - no real money charged.
                                    Use PayStack test phone numbers for mobile money.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                {currentMode === 'live' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <FaExclamationTriangle className="mr-2 mt-0.5 text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-red-800">🚨 LIVE MODE - Real Money</p>
                                <p className="text-xs text-red-700 mt-1">
                                    <strong>WARNING:</strong> This will charge real money from the customer's mobile money account.
                                    Ensure all details are correct before proceeding.
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
                            {currentMode === 'live' ? '💰 PAY (REAL MONEY)' : 
                             currentMode === 'test' ? '🧪 PAY (TEST)' : 
                             '🎭 PAY (DEMO)'} {formatAmount(totalAmount, 'GHS')}
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