import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useFirestore } from '../../contexts/FirestoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_PAYMENT_METHODS } from '../../services/stripeService';

const PaymentMethodManager = ({ 
  onPaymentMethodSelect, 
  selectedMethodId = null,
  showAddButton = true,
  className = ""
}) => {
  const { userProfile, updateProfile } = useFirestore();
  const { currentUser } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved payment methods from user profile
    if (userProfile?.profile?.paymentMethods) {
      setPaymentMethods(userProfile.profile.paymentMethods);
    } else {
      // For demo purposes, use demo payment methods
      setPaymentMethods(DEMO_PAYMENT_METHODS);
    }
  }, [userProfile]);

  const handleAddPaymentMethod = () => {
    // In a real app, this would open a payment method form
    console.log('Add payment method');
  };

  const handleEditPaymentMethod = (methodId) => {
    // In a real app, this would open an edit form
    console.log('Edit payment method:', methodId);
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (!currentUser) return;
    
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        setIsLoading(true);
        const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
        
        // Update user profile
        await updateProfile({
          'profile.paymentMethods': updatedMethods
        });
        
        setPaymentMethods(updatedMethods);
      } catch (error) {
        setError('Failed to delete payment method');
        console.error('Delete payment method error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSetDefault = async (methodId) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));

      await updateProfile({
        'profile.paymentMethods': updatedMethods
      });
      
      setPaymentMethods(updatedMethods);
    } catch (error) {
      setError('Failed to set default payment method');
      console.error('Set default error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    onPaymentMethodSelect(method);
  };

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'visa':
        return <div className="w-8 h-5 bg-blue-600 rounded border flex items-center justify-center text-white text-xs font-bold">V</div>;
      case 'mastercard':
        return <div className="w-8 h-5 bg-red-600 rounded border flex items-center justify-center text-white text-xs font-bold">MC</div>;
      case 'amex':
        return <div className="w-8 h-5 bg-green-600 rounded border flex items-center justify-center text-white text-xs font-bold">AE</div>;
      case 'discover':
        return <div className="w-8 h-5 bg-orange-600 rounded border flex items-center justify-center text-white text-xs font-bold">D</div>;
      default:
        return <FaCreditCard className="text-gray-400" />;
    }
  };

  const formatCardNumber = (last4) => {
    return `**** **** **** ${last4}`;
  };

  const formatExpiryDate = (month, year) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaCreditCard className="mr-2 text-primary-500" />
          Payment Methods
        </h3>
        {showAddButton && (
          <button
            onClick={handleAddPaymentMethod}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <FaPlus className="mr-2" />
            Add Method
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-3">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaCreditCard className="mx-auto text-4xl mb-4 text-gray-300" />
            <p>No payment methods saved</p>
            <p className="text-sm">Add a payment method to get started</p>
          </div>
        ) : (
          paymentMethods.map((method) => {
            const isSelected = selectedMethodId === method.id;
            
            return (
              <div
                key={method.id}
                className={`border rounded-lg p-4 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="mt-1">
                      {getCardIcon(method.card.brand)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {method.card.brand} Card
                        </h4>
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatCardNumber(method.card.last4)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {formatExpiryDate(method.card.exp_month, method.card.exp_year)}
                      </p>
                      {method.billing_details?.name && (
                        <p className="text-xs text-gray-500">
                          {method.billing_details.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Set as default"
                      >
                        <FaCheck />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEditPaymentMethod(method.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit payment method"
                    >
                      <FaEdit />
                    </button>
                    
                    <button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete payment method"
                    >
                      <FaTrash />
                    </button>
                    
                    {!isSelected && (
                      <button
                        onClick={() => handlePaymentMethodSelect(method)}
                        className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Demo Notice */}
      {paymentMethods.length > 0 && paymentMethods[0].id.startsWith('pm_demo') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <FaCreditCard className="mr-2 mt-0.5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-800">Demo Payment Methods</p>
              <p className="text-xs text-blue-700 mt-1">
                These are demo payment methods for testing. In a real app, these would be saved from actual Stripe payments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodManager;