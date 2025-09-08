import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaLocationArrow, FaSearch, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import { getCurrentLocation, reverseGeocode } from '../../services/locationService';
import LocationPicker from './LocationPicker';

const LocationAccess = ({ 
  onLocationSelect, 
  initialLocation = null,
  showSettings = false,
  onSettingsClick = null,
  className = ""
}) => {
  const [location, setLocation] = useState(initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
      } catch (error) {
        console.log('Permission check not supported');
      }
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    setError('');

    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Location error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLocationSelect = () => {
    setShowLocationPicker(true);
  };

  const handleLocationPickerSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    onLocationSelect(selectedLocation);
    setShowLocationPicker(false);
  };

  const handleLocationPickerClose = () => {
    setShowLocationPicker(false);
  };

  const getLocationStatusIcon = () => {
    if (isLoading) {
      return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />;
    }
    
    if (error) {
      return <FaExclamationTriangle className="text-red-500" />;
    }
    
    if (location) {
      return <FaMapMarkerAlt className="text-green-500" />;
    }
    
    return <FaLocationArrow className="text-gray-400" />;
  };

  const getLocationStatusText = () => {
    if (isLoading) {
      return 'Getting your location...';
    }
    
    if (error) {
      return 'Location access failed';
    }
    
    if (location) {
      return location.address || 'Location selected';
    }
    
    return 'Location not selected';
  };

  const getLocationStatusColor = () => {
    if (error) return 'text-red-600';
    if (location) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Status Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getLocationStatusIcon()}
            <div>
              <p className={`font-medium ${getLocationStatusColor()}`}>
                {getLocationStatusText()}
              </p>
              {location && (
                <p className="text-sm text-gray-500 mt-1">
                  Coordinates: {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
          
          {showSettings && onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Location Settings"
            >
              <FaCog />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <div className="flex items-start">
              <FaExclamationTriangle className="mr-2 mt-0.5 text-red-500" />
              <div>
                <p className="font-medium">Location Access Failed</p>
                <p className="text-sm mt-1">{error}</p>
                <div className="mt-2 text-sm">
                  <p>Please try one of these solutions:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Enable location permissions in your browser</li>
                    <li>Make sure your device location is turned on</li>
                    <li>Try selecting your location manually</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          <FaLocationArrow className="mr-2" />
          {isLoading ? 'Getting Location...' : 'Use Current Location'}
        </button>

        <button
          onClick={handleManualLocationSelect}
          className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaSearch className="mr-2" />
          Select Manually
        </button>
      </div>

      {/* Permission Status Info */}
      {permissionStatus === 'denied' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <FaExclamationTriangle className="mr-2 mt-0.5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-800">Location Permission Denied</p>
              <p className="text-sm text-yellow-700 mt-1">
                To use your current location, please enable location permissions in your browser settings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Free Service Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <FaMapMarkerAlt className="mr-2 mt-0.5 text-blue-500" />
          <div>
            <p className="font-medium text-blue-800">Free Location Service</p>
            <p className="text-sm text-blue-700 mt-1">
              This app uses OpenStreetMap and Nominatim for location services - completely free with no API keys required!
            </p>
          </div>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={handleLocationPickerClose}
        onLocationSelect={handleLocationPickerSelect}
        initialLocation={location}
        title="Select Your Delivery Location"
      />
    </div>
  );
};

export default LocationAccess;