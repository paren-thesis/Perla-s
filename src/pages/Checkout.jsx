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
  const [orderStep, setOrderStep] = useState(1); // 1: Delivery, 2: Review, 3: Payment, 4: Confirmation
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
    if (cart.items.length === 0 && orderStep < 4) {
      navigate('/menu');
    }
  }, [cart.items.length, navigate, orderStep]);

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
  };

  const handleLocationChange = (location) => {
    setUserLocation(location);
  };

  const handleNextStep = () => {
    if (orderStep === 1) {
      if (deliveryType === 'delivery' && !userLocation) {
        alert('Please select a delivery location to continue');
        return;
      }
      setOrderStep(2);
    } else if (orderStep === 2) {
      handlePlaceOrder();
    }
  };

  const handleBackStep = () => {
    if (orderStep > 1 && orderStep < 4) {
      setOrderStep(orderStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) return;

    setIsProcessing(true);
    try {
      const order = {
        orderId: `ORD-${Date.now()}`,
        userId: currentUser.uid,
        items: cart.items,
        total: parseFloat(cart.total),
        deliveryType,
        deliveryAddress: userLocation?.address || null,
        deliveryFee: deliveryType === 'delivery' ? 2.99 : 0,
        createdAt: new Date().toISOString(),
        status: 'pending',
        currency: 'GHS'
      };

      setOrderData(order);
      setOrderStep(3);
      setIsProcessing(false);
    } catch (error) {
      console.error('Order preparation error:', error);
      alert('Failed to prepare order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setPaymentIntent(paymentIntent);
      await clearUserCart();
      setOrderStep(4);
    } catch (error) {
      console.error('Payment success handling error:', error);
      alert('Order placed but there was an issue clearing your cart. Your payment was successful.');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const getStepTitle = () => {
    switch (orderStep) {
      case 1: return 'Delivery Method';
      case 2: return 'Review Order';
      case 3: return 'Secure Payment';
      case 4: return 'Order Confirmed';
      default: return 'Checkout';
    }
  };

  const getStepDescription = () => {
    switch (orderStep) {
      case 1: return 'How should we get your order to you?';
      case 2: return 'Check your items and delivery info';
      case 3: return 'Complete your transaction securely';
      case 4: return 'Success! Your order is being prepared';
      default: return '';
    }
  };

  const canProceed = () => {
    switch (orderStep) {
      case 1: return deliveryType === 'pickup' || (deliveryType === 'delivery' && userLocation);
      case 2: return true;
      default: return false;
    }
  };

  if (!currentUser || (cart.items.length === 0 && orderStep < 4)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button
            onClick={handleBackToMenu}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors w-fit"
          >
            <FaArrowLeft className="mr-2" />
            Back to Menu
          </button>

          <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <h1 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h1>
            <p className="text-sm text-gray-500">{getStepDescription()}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${orderStep >= step ? 'bg-primary-500 text-white shadow-primary-200' : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}>
                    {orderStep > step ? <FaCheck className="text-xs" /> : step}
                  </div>
                </div>
                {step < 4 && (
                  <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-all duration-300 ${orderStep > step ? 'bg-primary-500' : 'bg-gray-200'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {orderStep === 1 && (
            <DeliveryTypeSelector
              onDeliveryTypeChange={handleDeliveryTypeChange}
              onLocationChange={handleLocationChange}
            />
          )}

          {orderStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center mr-3">
                      <FaShoppingCart className="text-primary-500 text-sm" />
                    </div>
                    Items to Order
                  </h3>
                  <Cart
                    items={cart.items}
                    isReadOnly={true}
                    isMobile={false}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {deliveryType === 'delivery' ? 'Delivery Details' : 'Pickup Details'}
                  </h3>

                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Method</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{deliveryType}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        {deliveryType === 'delivery' ? 'Address' : 'Store Location'}
                      </p>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {deliveryType === 'delivery' ? userLocation?.address : '123 Main Street, Accra'}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Est. Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {deliveryType === 'delivery' ? '30-45 mins' : '15-20 mins'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {orderStep === 3 && orderData && (
            <div className="max-w-2xl mx-auto">
              <PaystackPaymentForm
                orderData={orderData}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {orderStep === 4 && paymentIntent && orderData && (
            <PaymentSuccess
              paymentIntent={paymentIntent}
              orderData={orderData}
              onNewOrder={() => navigate('/menu')}
              onBackToHome={() => navigate('/')}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {orderStep < 3 && (
          <div className="flex items-center justify-between mt-12 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={handleBackStep}
              disabled={orderStep === 1}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${orderStep === 1
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              Back
            </button>

            <button
              onClick={handleNextStep}
              disabled={!canProceed() || isProcessing}
              className={`px-10 py-3 rounded-xl font-bold transition-all shadow-lg ${!canProceed() || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200 hover:shadow-primary-300 transform active:scale-95'
                }`}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Syncing...
                </div>
              ) : (
                orderStep === 2 ? 'Go to Payment' : 'Next Step'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;