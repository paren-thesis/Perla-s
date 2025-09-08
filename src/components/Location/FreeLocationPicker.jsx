import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt, FaSearch, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import { geocodeAddress, searchAddresses, reverseGeocode } from '../../services/freeLocationService';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#3B82F6') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transform: rotate(-45deg);
    "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Map click handler component
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const address = await reverseGeocode(lat, lng);
        onLocationSelect({
          coordinates: { lat, lng },
          address: address
        });
      } catch (error) {
        console.error('Error getting address:', error);
        onLocationSelect({
          coordinates: { lat, lng },
          address: 'Selected location'
        });
      }
    }
  });
  return null;
};

const FreeLocationPicker = ({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  initialLocation = null,
  title = "Select Your Location"
}) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState(initialLocation?.coordinates || { lat: 5.6037, lng: -0.1870 });

  // Search for addresses
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const results = await searchAddresses(query, 5);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setError('Address not found. Please try a different search.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchResultClick = (result) => {
    setSelectedLocation(result);
    setSearchQuery(result.address);
    setSearchResults([]);
    setMapCenter(result.coordinates);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    onClose();
  };

  // Update marker when location changes
  useEffect(() => {
    if (selectedLocation && map) {
      setMarker(selectedLocation);
    }
  }, [selectedLocation, map]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaMapMarkerAlt className="mr-3 text-primary-500" />
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search for an address..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <FaSpinner className="animate-spin text-primary-500" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{result.address}</div>
                  {result.type && (
                    <div className="text-sm text-gray-500">{result.type}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            whenCreated={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            
            {marker && (
              <Marker
                position={marker.coordinates}
                icon={createCustomIcon('#3B82F6')}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-medium">{marker.address}</p>
                    <p className="text-sm text-gray-500">
                      {marker.coordinates.lat.toFixed(4)}, {marker.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
          
          {/* Map Instructions */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <p className="text-sm text-gray-600">
              Click on the map or search for an address to select your location
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="absolute top-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedLocation ? (
              <span className="text-green-600 font-medium">
                ✓ Location selected
              </span>
            ) : (
              <span>Please select a location</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                selectedLocation
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaCheck className="mr-2" />
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeLocationPicker;