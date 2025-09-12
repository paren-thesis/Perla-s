import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaCreditCard, FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';
import DeliveryTypeSelector from '../components/Checkout/DeliveryTypeSelector';
import PaystackPaymentForm from '../components/Payment/PaystackPaymentForm';
import PaymentSuccess from '../components/Payment/PaymentSuccess';
import Cart from '../components/Menu/Cart';


const Checkout = () => {
  const { currentUser } = useAuth();
  const { cart, clearUserCart } = useFirestore();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState('pickup');
  const [userLocation, setUserLocation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStep, setOrderStep] = useState(1); // 1: Delivery Type, 2: Review, 3: Payment, 4: Confirmation
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', {
        state: { from: 'checkout' }
      });
    }
  }, [currentUser, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/menu');
    }
  }, [cart.items.length, navigate]);

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
  };

  const handleLocationChange = (location) => {
    setUserLocation(location);
  };

  const handleNextStep = () => {
    if (orderStep === 1) {
      // Validate delivery type selection
      if (deliveryType === 'delivery' && !userLocation) {
        alert('Please select a delivery location to continue');
        return;
      }
      setOrderStep(2);
    } else if (orderStep === 2) {
      setOrderStep(3);
    } else if (orderStep === 3) {
      handlePlaceOrder();
    }
  };

  const handleBackStep = () => {
    if (orderStep > 1) {
      setOrderStep(orderStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) return;

    setIsProcessing(true);
    try {
      // Create order data
      const order = {
        orderId: `ORD-${Date.now()}`,
        userId: currentUser.uid,
        items: cart.items,
        total: parseFloat(cart.total),
        deliveryType,
        deliveryAddress: userLocation?.address || null,
        deliveryFee: deliveryType === 'delivery' ? 2.99 : 0, // This would be calculated
        createdAt: new Date().toISOString(),
        status: 'pending',
        currency: 'GHS' // Ensure currency is set
      };

      setOrderData(order);
      // Use setTimeout to ensure state updates are processed in the correct order
      setTimeout(() => {
        setOrderStep(4); // Move to payment step
        setIsProcessing(false);
      }, 0);
    } catch (error) {
      console.error('Order processing error:', error);
      alert('Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setPaymentIntent(paymentIntent);

      // Clear cart
      await clearUserCart();

      // Move to success step
      setOrderStep(5);
    } catch (error) {
      console.error('Payment success handling error:', error);
      alert('Order placed but there was an issue. Please contact support.');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleNewOrder = () => {
    navigate('/menu');
  };

  const getStepTitle = () => {
    switch (orderStep) {
      case 1: return 'Delivery Method';
      case 2: return 'Review Order';
      case 3: return 'Payment';
      case 4: return 'Payment';
      case 5: return 'Order Confirmed';
      default: return 'Checkout';
    }
  };

  const getStepDescription = () => {
    switch (orderStep) {
      case 1: return 'Choose how you want to receive your order';
      case 2: return 'Review your order details and delivery information';
      case 3: return 'Complete your payment';
      case 4: return 'Complete your payment';
      case 5: return 'Your order has been placed successfully';
      default: return '';
    }
  };

  const canProceed = () => {
    switch (orderStep) {
      case 1: return deliveryType === 'pickup' || (deliveryType === 'delivery' && userLocation);
      case 2: return true;
      case 3: return true;
      case 4: return false; // Payment form handles its own submission
      case 5: return false; // Success step
      default: return false;
    }
  };

  if (!currentUser || cart.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToMenu}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Menu
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>
            <p className="text-gray-600">{getStepDescription()}</p>
          </div>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${orderStep >= step
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}>
                  {orderStep > step ? <FaCheck /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-8 h-0.5 ml-2 ${orderStep > step ? 'bg-primary-500' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Delivery Method */}
          {orderStep === 1 && (
            <DeliveryTypeSelector
              onDeliveryTypeChange={handleDeliveryTypeChange}
              onLocationChange={handleLocationChange}
            />
          )}

          {/* Step 2: Review Order */}
          {orderStep === 2 && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaShoppingCart className="mr-2 text-primary-500" />
                  Order Summary
                </h3>
                <Cart
                  items={cart.items}
                  onIncrement={() => { }} // Read-only in checkout
                  onDecrement={() => { }} // Read-only in checkout
                  onRemove={() => { }} // Read-only in checkout
                  onSubmit={() => { }} // Not used in review
                  onClearCart={() => { }} // Not used in review
                  isMobile={false}
                  isReadOnly={true}
                />
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {deliveryType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
                </h3>

                {deliveryType === 'delivery' ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Delivery Address</p>
                        <p className="text-gray-600">{userLocation?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Estimated Delivery Time</p>
                        <p className="text-gray-600">20-30 minutes</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Pickup Location</p>
                        <p className="text-gray-600">123 Main Street, Accra, Ghana</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Estimated Ready Time</p>
                        <p className="text-gray-600">15-20 minutes</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Payment (Legacy) */}
          {orderStep === 3 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-primary-500" />
                Payment Information
              </h3>

              <div className="text-center py-12">
                <FaCreditCard className="mx-auto text-6xl text-gray-300 mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Integration Coming Soon
                </h4>
                <p className="text-gray-600 mb-6">
                  Stripe payment integration will be added in the next step
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-yellow-800">
                    For now, this is a demo checkout. In a real app, you would integrate with Stripe or another payment processor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {orderStep === 4 && orderData && (
            <PaystackPaymentForm
              orderData={orderData}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              isProcessing={isProcessing}
            />
          )}

          {/* Step 5: Confirmation */}
          {orderStep === 5 && paymentIntent && orderData && (
            <PaymentSuccess
              paymentIntent={paymentIntent}
              orderData={orderData}
              onNewOrder={handleNewOrder}
              onBackToHome={() => navigate('/')}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {orderStep < 5 && orderStep !== 4 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBackStep}
              disabled={orderStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${orderStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              Back
            </button>

            <button
              onClick={handleNextStep}
              disabled={!canProceed() || isProcessing}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${!canProceed() || isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                orderStep === 3 ? 'Proceed to Payment' : 'Continue'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;