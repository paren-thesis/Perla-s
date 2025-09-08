import { Loader } from '@googlemaps/js-api-loader';

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Initialize Google Maps loader
const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

// Cache for Google Maps instance
let googleMapsInstance = null;

/**
 * Initialize Google Maps
 */
export const initializeGoogleMaps = async () => {
  if (googleMapsInstance) {
    return googleMapsInstance;
  }

  try {
    googleMapsInstance = await loader.load();
    return googleMapsInstance;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    throw new Error('Failed to load Google Maps');
  }
};

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
 * Reverse geocode coordinates to get address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Formatted address
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const google = await initializeGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error('Geocoding failed'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw new Error('Failed to get address from coordinates');
  }
};

/**
 * Geocode address to get coordinates
 * @param {string} address - Address string
 * @returns {Promise<Object>} Coordinates and formatted address
 */
export const geocodeAddress = async (address) => {
  try {
    const google = await initializeGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { address },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              coordinates: {
                lat: location.lat(),
                lng: location.lng()
              },
              address: results[0].formatted_address,
              placeId: results[0].place_id
            });
          } else {
            reject(new Error('Address not found'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in geocoding:', error);
    throw new Error('Failed to get coordinates from address');
  }
};

/**
 * Calculate distance between two coordinates
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

// Restaurant location (you can update this to your actual restaurant location)
export const RESTAURANT_LOCATION = {
  lat: 5.6037, // Accra, Ghana coordinates (update to your restaurant location)
  lng: -0.1870,
  address: "123 Main Street, Accra, Ghana" // Update to your actual address
};