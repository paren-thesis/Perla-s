import React from 'react';
import { FaCheckCircle, FaReceipt, FaDownload, FaShare, FaHome, FaShoppingCart } from 'react-icons/fa';
import { formatAmount } from '../../services/paystackService';

const PaymentSuccess = ({
  paymentIntent, // This is data from Paystack verification
  orderData,
  onNewOrder,
  onBackToHome,
  className = ""
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatOrderId = (ref) => {
    if (!ref) return 'ORD-UNKNOWN';
    // If it's a Paystack reference like PAYSTACK_ORD-123_456, extract the middle part
    if (ref.startsWith('PAYSTACK_')) {
      const parts = ref.split('_');
      return parts[1] || ref;
    }
    return ref;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Success Header */}
      <div className="bg-green-500 py-12 text-center text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <FaCheckCircle className="text-4xl text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
        <p className="opacity-90">Thank you for your order, {orderData.items.length > 0 ? 'we are preparing it now' : ''}</p>
      </div>

      <div className="p-8">
        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FaReceipt className="mr-2 text-primary-500" />
              Receipt Details
            </h3>

            <div className="space-y-3 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-bold text-gray-900">
                  {formatOrderId(paymentIntent.reference)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(paymentIntent.paid_at || paymentIntent.created_at)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Method:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {paymentIntent.channel?.replace('_', ' ') || 'Mobile Money'}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Paid</span>
                  <span className="text-xl font-black text-primary-600">
                    {formatAmount(paymentIntent.amount / 100, (paymentIntent.currency || 'GHS').toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
            <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100 h-full">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                  <p className="text-sm text-primary-900">
                    <strong>Preparation</strong>: Our chef has received your order and is starting to cook.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                  <p className="text-sm text-primary-900">
                    <strong>{orderData.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</strong>:
                    {orderData.deliveryType === 'delivery'
                      ? 'A rider will pick up your order in about 15-20 minutes.'
                      : 'We will notify you when it is ready for collection.'}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-primary-100">
                <p className="text-[10px] text-primary-700 uppercase font-black tracking-widest mb-1">Store Address</p>
                <p className="text-xs text-primary-900">123 Main Street, Accra, Ghana</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-gray-100 pt-10">
          <button
            onClick={onNewOrder}
            className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold shadow-lg shadow-primary-100 active:scale-95"
          >
            <FaShoppingCart className="mr-2" />
            Place New Order
          </button>

          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold active:scale-95"
          >
            <FaHome className="mr-2" />
            Go to Home
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 mb-4">A copy of this receipt has been sent to your email</p>
          <div className="flex items-center justify-center space-x-6">
            <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center transition-colors">
              <FaDownload className="mr-1.5" /> Receipt
            </button>
            <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center transition-colors">
              <FaShare className="mr-1.5" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;