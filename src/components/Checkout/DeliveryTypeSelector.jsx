import React, { useState, useEffect } from 'react';
import { FaTruck, FaStore, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import { useFirestore } from '../../contexts/FirestoreContext';
import { useAuth } from '../../contexts/AuthContext';
import LocationAccess from '../Location/LocationAccess';
import DeliveryFeeCalculator from '../Location/DeliveryFeeCalculator';

const DeliveryTypeSelector = ({ 
  onDeliveryTypeChange, 
  onLocationChange,
  className = "" 
}) => {
  const { userProfile } = useFirestore();
  const { currentUser } = useAuth();
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationAccess, setShowLocationAccess] = useState(false);

  // Load user's default delivery preference
  useEffect(() => {
    if (userProfile?.profile?.preferences?.deliveryPreferences?.deliveryType) {
      const userPreference = userProfile.profile.preferences.deliveryPreferences.deliveryType;
      setDeliveryType(userPreference);
      onDeliveryTypeChange(userPreference);
    }
  }, [userProfile]);

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
    onDeliveryTypeChange(type);
    
    // Clear location if switching to pickup
    if (type === 'pickup') {
      setUserLocation(null);
      onLocationChange(null);
    }
  };

  const handleLocationSelect = (location) => {
    setUserLocation(location);
    onLocationChange(location);
    setShowLocationAccess(false);
  };

  const handleLocationAccessClick = () => {
    setShowLocationAccess(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Delivery Type Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How would you like to receive your order?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Option */}
          <button
            onClick={() => handleDeliveryTypeChange('pickup')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              deliveryType === 'pickup'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                deliveryType === 'pickup' ? 'bg-primary-500' : 'bg-gray-200'
              }`}>
                <FaStore className={`text-lg ${
                  deliveryType === 'pickup' ? 'text-white' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Pickup</h4>
                <p className="text-sm text-gray-600">Pick up at the restaurant</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <FaClock className="mr-1" />
              <span>Ready in 15-20 minutes</span>
            </div>
          </button>

          {/* Delivery Option */}
          <button
            onClick={() => handleDeliveryTypeChange('delivery')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              deliveryType === 'delivery'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                deliveryType === 'delivery' ? 'bg-primary-500' : 'bg-gray-200'
              }`}>
                <FaTruck className={`text-lg ${
                  deliveryType === 'delivery' ? 'text-white' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Delivery</h4>
                <p className="text-sm text-gray-600">Delivered to your location</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <FaDollarSign className="mr-1" />
              <span>Delivery fee applies</span>
            </div>
          </button>
        </div>
      </div>

      {/* Location Selection for Delivery */}
      {deliveryType === 'delivery' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-primary-500" />
              Delivery Location
            </h3>
            <button
              onClick={handleLocationAccessClick}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
            >
              {userLocation ? 'Change Location' : 'Select Location'}
            </button>
          </div>

          {userLocation ? (
            <div className="space-y-4">
              {/* Selected Location Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-green-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{userLocation.address}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {userLocation.coordinates.lat.toFixed(4)}, {userLocation.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Fee Calculator */}
              <DeliveryFeeCalculator
                userLocation={userLocation}
                showDetails={true}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaMapMarkerAlt className="mx-auto text-4xl mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No location selected</p>
              <p className="text-sm">Please select your delivery location to continue</p>
            </div>
          )}
        </div>
      )}

      {/* Pickup Information */}
      {deliveryType === 'pickup' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaStore className="mr-2 text-primary-500" />
            Pickup Information
          </h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <FaStore className="mr-3 mt-1 text-blue-500" />
              <div>
                <h4 className="font-medium text-blue-900">Restaurant Location</h4>
                <p className="text-sm text-blue-700 mt-1">
                  123 Main Street, Accra, Ghana
                </p>
                <div className="mt-2 text-sm text-blue-600">
                  <p>• Opening Hours: 11:00 AM - 10:00 PM</p>
                  <p>• Estimated Ready Time: 15-20 minutes</p>
                  <p>• Contact: (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Access Modal */}
      {showLocationAccess && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Select Delivery Location</h3>
              <LocationAccess
                onLocationSelect={handleLocationSelect}
                showSettings={false}
              />
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowLocationAccess(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTypeSelector;