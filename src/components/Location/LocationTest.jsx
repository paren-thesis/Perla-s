import React, { useState } from 'react';
import LocationAccess from './LocationAccess';
import DeliveryFeeCalculator from './DeliveryFeeCalculator';
import LocationPicker from './LocationPicker';

const LocationTest = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleLocationSelect = (location) => {
    setUserLocation(location);
    console.log('Location selected:', location);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Location Services Test
        </h1>
        <p className="text-gray-600">
          Test the free OpenStreetMap location services
        </p>
      </div>

      {/* Location Access Component */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Location Access</h2>
        <LocationAccess
          onLocationSelect={handleLocationSelect}
          showSettings={true}
        />
      </div>

      {/* Delivery Fee Calculator */}
      {userLocation && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          <DeliveryFeeCalculator
            userLocation={userLocation}
            showDetails={true}
          />
        </div>
      )}

      {/* Location Picker Test */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Location Picker Test</h2>
        <button
          onClick={() => setShowPicker(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Open Location Picker
        </button>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onLocationSelect={handleLocationSelect}
        title="Test Location Picker"
      />

      {/* Current Location Display */}
      {userLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Current Location</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Address:</strong> {userLocation.address}</p>
            <p><strong>Coordinates:</strong> {userLocation.coordinates.lat.toFixed(6)}, {userLocation.coordinates.lng.toFixed(6)}</p>
            {userLocation.accuracy && (
              <p><strong>Accuracy:</strong> {userLocation.accuracy.toFixed(0)} meters</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTest;