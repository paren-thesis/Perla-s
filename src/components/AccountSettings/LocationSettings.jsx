import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCog, FaSave, FaLocationArrow, FaTruck, FaStore } from 'react-icons/fa';
import { useFirestore } from '../../contexts/FirestoreContext';
import { useAuth } from '../../contexts/AuthContext';
import DeliveryAddressManager from '../Location/DeliveryAddressManager';
import LocationAccess from '../Location/LocationAccess';

const LocationSettings = () => {
  const { userProfile, updateProfile } = useFirestore();
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    useCurrentLocation: false,
    deliveryType: 'pickup',
    autoLocation: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLocationAccess, setShowLocationAccess] = useState(false);

  useEffect(() => {
    if (userProfile?.profile?.preferences?.deliveryPreferences) {
      setSettings(userProfile.profile.preferences.deliveryPreferences);
    }
  }, [userProfile]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const updates = {
        'profile.preferences.deliveryPreferences': settings
      };

      await updateProfile(updates);
      setSuccess('Location settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save settings. Please try again.');
      console.error('Save settings error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    console.log('Location selected:', location);
    setShowLocationAccess(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-primary-500" />
          Location & Delivery Settings
        </h3>
        <button
          onClick={() => setShowLocationAccess(true)}
          className="flex items-center px-3 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <FaLocationArrow className="mr-2" />
          Test Location
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Delivery Type Preference */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900">Default Order Method</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="deliveryType"
                value="pickup"
                checked={settings.deliveryType === 'pickup'}
                onChange={(e) => handleSettingChange('deliveryType', e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <FaStore className="text-gray-500" />
              <div>
                <span className="font-medium text-gray-700">Pickup</span>
                <p className="text-sm text-gray-500">Pick up your order at the restaurant</p>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="deliveryType"
                value="delivery"
                checked={settings.deliveryType === 'delivery'}
                onChange={(e) => handleSettingChange('deliveryType', e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <FaTruck className="text-gray-500" />
              <div>
                <span className="font-medium text-gray-700">Delivery</span>
                <p className="text-sm text-gray-500">Have your order delivered to your location</p>
              </div>
            </label>
          </div>
        </div>

        {/* Location Access Settings */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900">Location Access</h4>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={settings.useCurrentLocation}
                onChange={(e) => handleSettingChange('useCurrentLocation', e.target.checked)}
                className="mt-1 text-primary-500 focus:ring-primary-500"
              />
              <div>
                <span className="text-gray-700 font-medium">Allow location access</span>
                <p className="text-sm text-gray-500 mt-1">
                  Enable this to automatically use your current location for delivery addresses.
                  This will request permission to access your device's location.
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={settings.autoLocation}
                onChange={(e) => handleSettingChange('autoLocation', e.target.checked)}
                disabled={!settings.useCurrentLocation}
                className="mt-1 text-primary-500 focus:ring-primary-500 disabled:opacity-50"
              />
              <div>
                <span className="text-gray-700 font-medium">Auto-select current location</span>
                <p className="text-sm text-gray-500 mt-1">
                  When enabled, your current location will be automatically selected for delivery
                  without requiring manual confirmation each time.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Delivery Addresses Management */}
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900">Saved Addresses</h4>
          <DeliveryAddressManager
            showAddButton={true}
            className="border-t border-gray-200 pt-4"
          />
        </div>

        {/* Location Permission Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <FaLocationArrow className="mr-3 mt-1 text-blue-500" />
            <div>
              <h4 className="font-medium text-blue-900">Location Permissions</h4>
              <p className="text-sm text-blue-700 mt-1">
                To use location features, make sure your browser has permission to access your location.
                You can manage this in your browser settings.
              </p>
              <div className="mt-2 text-xs text-blue-600">
                <p>• Chrome: Settings → Privacy and security → Site settings → Location</p>
                <p>• Firefox: Settings → Privacy & Security → Permissions → Location</p>
                <p>• Safari: Preferences → Websites → Location</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Location Access Modal */}
      {showLocationAccess && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Test Location Access</h3>
              <LocationAccess
                onLocationSelect={handleLocationSelect}
                showSettings={false}
              />
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowLocationAccess(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSettings;