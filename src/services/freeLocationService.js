// Free location service using OpenStreetMap and Nominatim
// No API key required!

/**
 * Get current location using GPS
 * @returns {Promise<Object>} Location object with coordinates and address
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          
          resolve({
            coordinates: { lat: latitude, lng: longitude },
            address: address,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Reverse geocode coordinates to get address using Nominatim (OpenStreetMap)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Formatted address
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RestaurantApp/1.0' // Required by Nominatim
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    } else {
      throw new Error('No address found');
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw new Error('Failed to get address from coordinates');
  }
};

/**
 * Geocode address to get coordinates using Nominatim
 * @param {string} address - Address string
 * @returns {Promise<Object>} Coordinates and formatted address
 */
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RestaurantApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        },
        address: result.display_name,
        placeId: result.place_id
      };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Error in geocoding:', error);
    throw new Error('Failed to get coordinates from address');
  }
};

/**
 * Search for addresses using Nominatim
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of address results
 */
export const searchAddresses = async (query, limit = 5) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'RestaurantApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    
    const data = await response.json();
    
    return data.map(result => ({
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      },
      address: result.display_name,
      placeId: result.place_id,
      type: result.type,
      importance: result.importance
    }));
  } catch (error) {
    console.error('Error in address search:', error);
    throw new Error('Failed to search addresses');
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - First coordinates {lat, lng}
 * @param {Object} coord2 - Second coordinates {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Check if location is within delivery radius
 * @param {Object} userLocation - User coordinates
 * @param {Object} restaurantLocation - Restaurant coordinates
 * @param {number} radiusKm - Delivery radius in kilometers
 * @returns {boolean} Whether location is within delivery area
 */
export const isWithinDeliveryRadius = (userLocation, restaurantLocation, radiusKm = 10) => {
  const distance = calculateDistance(userLocation, restaurantLocation);
  return distance <= radiusKm;
};

/**
 * Get delivery fee based on distance
 * @param {Object} userLocation - User coordinates
 * @param {Object} restaurantLocation - Restaurant coordinates
 * @param {Object} feeStructure - Fee structure configuration
 * @returns {number} Delivery fee
 */
export const calculateDeliveryFee = (userLocation, restaurantLocation, feeStructure = {}) => {
  const {
    baseFee = 2.99,
    perKmFee = 0.50,
    maxFee = 8.99,
    freeDeliveryThreshold = 5 // km
  } = feeStructure;

  const distance = calculateDistance(userLocation, restaurantLocation);
  
  if (distance <= freeDeliveryThreshold) {
    return 0;
  }
  
  const fee = baseFee + (distance - freeDeliveryThreshold) * perKmFee;
  return Math.min(fee, maxFee);
};

/**
 * Get estimated delivery time based on distance
 * @param {Object} userLocation - User coordinates
 * @param {Object} restaurantLocation - Restaurant coordinates
 * @returns {string} Estimated delivery time
 */
export const getEstimatedDeliveryTime = (userLocation, restaurantLocation) => {
  const distance = calculateDistance(userLocation, restaurantLocation);
  
  // Base preparation time: 15-25 minutes
  const baseTime = 20;
  
  // Add 2 minutes per kilometer
  const travelTime = Math.ceil(distance * 2);
  
  const totalMinutes = baseTime + travelTime;
  
  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
};

/**
 * Format address for display
 * @param {string} address - Full address
 * @returns {Object} Formatted address components
 */
export const formatAddress = (address) => {
  const parts = address.split(',');
  return {
    street: parts[0]?.trim() || '',
    city: parts[1]?.trim() || '',
    state: parts[2]?.trim() || '',
    country: parts[3]?.trim() || '',
    full: address
  };
};

/**
 * Validate coordinates
 * @param {Object} coordinates - Coordinates to validate
 * @returns {boolean} Whether coordinates are valid
 */
export const validateCoordinates = (coordinates) => {
  if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
    return false;
  }
  
  return coordinates.lat >= -90 && coordinates.lat <= 90 && 
         coordinates.lng >= -180 && coordinates.lng <= 180;
};

// Restaurant location (update to your actual restaurant location)
export const RESTAURANT_LOCATION = {
  lat: 5.6037, // Accra, Ghana coordinates (update to your restaurant location)
  lng: -0.1870,
  address: "123 Main Street, Accra, Ghana" // Update to your actual address
};