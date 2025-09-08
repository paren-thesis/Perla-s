import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import { initializeGoogleMaps, geocodeAddress } from '../../services/locationService';

const LocationPicker = ({ 
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
  const mapRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (isOpen && mapRef.current) {
      initializeMap();
    }
  }, [isOpen]);

  // Update marker when selected location changes
  useEffect(() => {
    if (map && selectedLocation) {
      updateMarker(selectedLocation);
    }
  }, [map, selectedLocation]);

  const initializeMap = async () => {
    try {
      const google = await initializeGoogleMaps();
      
      const mapOptions = {
        center: selectedLocation?.coordinates || { lat: 5.6037, lng: -0.1870 },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };

      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      // Add click listener to map
      newMap.addListener('click', (event) => {
        const location = {
          coordinates: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          },
          address: 'Selected location'
        };
        setSelectedLocation(location);
      });

      // Add initial marker if location is provided
      if (selectedLocation) {
        updateMarker(selectedLocation);
      }

    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to load map. Please try again.');
    }
  };

  const updateMarker = (location) => {
    if (!map) return;

    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Create new marker
    const google = window.google;
    const newMarker = new google.maps.Marker({
      position: location.coordinates,
      map: map,
      title: location.address,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    // Add drag listener
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      const newLocation = {
        coordinates: {
          lat: position.lat(),
          lng: position.lng()
        },
        address: 'Selected location'
      };
      setSelectedLocation(newLocation);
    });

    setMarker(newMarker);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const result = await geocodeAddress(query);
      setSearchResults([result]);
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

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const handleSearchResultClick = (result) => {
    setSelectedLocation(result);
    setSearchQuery(result.address);
    setSearchResults([]);
    
    // Center map on selected location
    if (map) {
      map.setCenter(result.coordinates);
      map.setZoom(15);
    }
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
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
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
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full rounded-b-2xl" />
          
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

export default LocationPicker;