# Location Services Setup Guide - Step 2

## Overview
This step implements GPS location access, Google Maps integration, and location picker components for your restaurant app.

## Prerequisites
- Step 1 (Firestore Setup) must be completed
- Google Maps API key required

## 1. Google Maps API Setup

### Get Google Maps API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Restrict the API key to your domain for security

### Add API Key to Environment:
1. Copy `.env.example` to `.env`
2. Add your Google Maps API key:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 2. Components Created

### Location Service (`src/services/locationService.js`)
- GPS location access
- Google Maps integration
- Geocoding and reverse geocoding
- Distance calculations
- Delivery fee calculations
- Address validation

### Location Components:
- **LocationPicker** - Interactive map for location selection
- **LocationAccess** - GPS access with fallback to manual selection
- **DeliveryAddressManager** - Manage saved delivery addresses
- **LocationSettings** - User location preferences
- **DeliveryFeeCalculator** - Calculate delivery fees and times

## 3. Features Implemented

### ✅ GPS Location Access
- Request user permission for location
- Get current coordinates
- Handle permission denied scenarios
- Fallback to manual selection

### ✅ Google Maps Integration
- Interactive map with location picker
- Search for addresses
- Drag and drop marker
- Address geocoding

### ✅ Delivery Address Management
- Save multiple addresses
- Set default address
- Edit/delete addresses
- Address labels (Home, Work, etc.)

### ✅ Location Settings
- Auto-location preferences
- Delivery vs pickup preference
- Location permission management

### ✅ Delivery Fee Calculation
- Distance-based pricing
- Free delivery threshold
- Delivery radius validation
- Estimated delivery time

## 4. Usage Examples

### Basic Location Access:
```jsx
import LocationAccess from './components/Location/LocationAccess';

function Checkout() {
  const handleLocationSelect = (location) => {
    console.log('Selected location:', location);
  };

  return (
    <LocationAccess
      onLocationSelect={handleLocationSelect}
      showSettings={true}
    />
  );
}
```

### Delivery Fee Calculator:
```jsx
import DeliveryFeeCalculator from './components/Location/DeliveryFeeCalculator';

function Checkout({ userLocation }) {
  return (
    <DeliveryFeeCalculator
      userLocation={userLocation}
      showDetails={true}
    />
  );
}
```

### Address Management:
```jsx
import DeliveryAddressManager from './components/Location/DeliveryAddressManager';

function Settings() {
  const handleAddressSelect = (address) => {
    console.log('Selected address:', address);
  };

  return (
    <DeliveryAddressManager
      onAddressSelect={handleAddressSelect}
      showAddButton={true}
    />
  );
}
```

## 5. Configuration

### Restaurant Location
Update the restaurant coordinates in `src/services/locationService.js`:
```javascript
export const RESTAURANT_LOCATION = {
  lat: 5.6037, // Your restaurant latitude
  lng: -0.1870, // Your restaurant longitude
  address: "123 Main Street, Accra, Ghana" // Your actual address
};
```

### Delivery Fee Structure
Customize delivery fees in `DeliveryFeeCalculator.jsx`:
```javascript
const feeStructure = {
  baseFee: 2.99,           // Base delivery fee
  perKmFee: 0.50,          // Fee per kilometer
  maxFee: 8.99,            // Maximum delivery fee
  freeDeliveryThreshold: 5, // Free delivery within 5km
  maxDeliveryRadius: 10     // Maximum delivery distance
};
```

## 6. Testing

### Test GPS Location:
1. Open your app in a browser
2. Click "Use Current Location"
3. Allow location permission
4. Verify coordinates are displayed

### Test Map Integration:
1. Click "Select Manually"
2. Search for an address
3. Click on the map to select location
4. Verify address is geocoded correctly

### Test Delivery Calculation:
1. Select a location
2. Verify delivery fee is calculated
3. Check if location is within delivery radius
4. Verify estimated delivery time

## 7. Browser Compatibility

### Supported Browsers:
- Chrome 50+
- Firefox 55+
- Safari 10+
- Edge 79+

### Required Permissions:
- Location access (GPS)
- HTTPS connection (required for location API)

## 8. Security Considerations

### API Key Security:
- Restrict API key to your domain
- Enable only required APIs
- Monitor API usage
- Set usage quotas

### Location Privacy:
- Only request location when needed
- Store location data securely
- Allow users to delete location data
- Clear location data on logout

## 9. Troubleshooting

### Common Issues:

**"Location access denied"**
- Check browser permissions
- Ensure HTTPS connection
- Verify location services are enabled

**"Google Maps failed to load"**
- Check API key configuration
- Verify API is enabled
- Check network connection

**"Address not found"**
- Try different address formats
- Check if address exists in Google Maps
- Verify geocoding API is enabled

### Debug Mode:
Enable console logging by adding to your `.env`:
```env
VITE_DEBUG_LOCATION=true
```

## 10. Next Steps

After completing this step:
1. Test all location features
2. Configure your restaurant location
3. Set up delivery fee structure
4. Ready for Step 3: Enhanced User Settings

## Files Modified/Created:

### New Files:
- `src/services/locationService.js`
- `src/components/Location/LocationPicker.jsx`
- `src/components/Location/LocationAccess.jsx`
- `src/components/Location/DeliveryAddressManager.jsx`
- `src/components/Location/LocationSettings.jsx`
- `src/components/Location/DeliveryFeeCalculator.jsx`
- `.env.example`

### Updated Files:
- None (this step only adds new components)

The location services are now ready! Users can access their GPS location, select addresses on a map, manage delivery addresses, and see delivery fees calculated automatically.