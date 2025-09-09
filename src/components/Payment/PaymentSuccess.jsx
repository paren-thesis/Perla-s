import React from 'react';
import { FaCheckCircle, FaReceipt, FaDownload, FaShare, FaHome, FaShoppingCart } from 'react-icons/fa';
import { formatAmount } from '../../services/paystackService';

const PaymentSuccess = ({ 
  paymentIntent, 
  orderData,
  onNewOrder,
  onBackToHome,
  className = ""
}) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatOrderId = (id) => {
    return id.replace('pi_', 'ORD-').toUpperCase();
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}>
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaCheckCircle className="text-4xl text-green-600" />
      </div>

      {/* Success Message */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Payment Successful!
      </h2>
      
      <p className="text-gray-600 mb-8">
        Your order has been confirmed and payment has been processed.
      </p>

      {/* Order Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaReceipt className="mr-2 text-primary-500" />
          Order Details
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID</span>
            <span className="font-medium text-gray-900">
              {formatOrderId(paymentIntent.id)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Date</span>
            <span className="font-medium text-gray-900">
              {formatDate(paymentIntent.created)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium text-gray-900 capitalize">
              {paymentIntent.payment_method?.type || 'Card'} ending in ****
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Order Type</span>
            <span className="font-medium text-gray-900 capitalize">
              {orderData.deliveryType}
            </span>
          </div>
          
          {orderData.deliveryType === 'delivery' && orderData.deliveryAddress && (
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Address</span>
              <span className="font-medium text-gray-900 text-right max-w-xs">
                {orderData.deliveryAddress}
              </span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-primary-600">
                {formatAmount(paymentIntent.amount / 100, paymentIntent.currency.toUpperCase())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Items
        </h3>
        
        <div className="space-y-2">
          {orderData.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium text-gray-900">
                {formatAmount(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          What's Next?
        </h3>
        
        <div className="text-left space-y-2 text-sm text-blue-800">
          {orderData.deliveryType === 'pickup' ? (
            <>
              <p>• Your order is being prepared</p>
              <p>• Estimated ready time: 15-20 minutes</p>
              <p>• Pick up at: 123 Main Street, Accra, Ghana</p>
              <p>• Contact: (555) 123-4567</p>
            </>
          ) : (
            <>
              <p>• Your order is being prepared</p>
              <p>• Estimated delivery time: 20-30 minutes</p>
              <p>• You'll receive updates via SMS/email</p>
              <p>• Contact: (555) 123-4567 for questions</p>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onNewOrder}
          className="flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          <FaShoppingCart className="mr-2" />
          Place Another Order
        </button>
        
        <button
          onClick={onBackToHome}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <FaHome className="mr-2" />
          Back to Home
        </button>
      </div>

      {/* Additional Actions */}
      <div className="mt-6 flex justify-center space-x-4">
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <FaDownload className="mr-1" />
          Download Receipt
        </button>
        
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <FaShare className="mr-1" />
          Share Order
        </button>
      </div>

      {/* Support Information */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Need help? Contact us at{' '}
          <a href="tel:5551234567" className="text-primary-600 hover:underline">
            (555) 123-4567
          </a>{' '}
          or{' '}
          <a href="mailto:support@perlas.com" className="text-primary-600 hover:underline">
            support@perlas.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;