import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLocationArrow, FaCog, FaSave, FaTimes } from 'react-icons/fa';
import { useFirestore } from '../../contexts/FirestoreContext';
import { useAuth } from '../../contexts/AuthContext';
import DeliveryAddressManager from './DeliveryAddressManager';

const LocationSettings = ({ isOpen, onClose }) => {
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

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCog className="mr-3 text-primary-500" />
            Location Settings
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Delivery Type Preference */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Preference</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  checked={settings.deliveryType === 'pickup'}
                  onChange={(e) => handleSettingChange('deliveryType', e.target.value)}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-gray-700">Pickup (Default)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={settings.deliveryType === 'delivery'}
                  onChange={(e) => handleSettingChange('deliveryType', e.target.value)}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-gray-700">Delivery</span>
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Choose your preferred order method. You can change this anytime during checkout.
            </p>
          </div>

          {/* Location Access Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Location Access</h3>
            
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
            <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
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
    </div>
  );
};

export default LocationSettings;