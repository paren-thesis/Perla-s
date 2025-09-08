import React, { useState, useEffect } from 'react';
import { FaTruck, FaClock, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { 
  calculateDistance, 
  calculateDeliveryFee, 
  getEstimatedDeliveryTime,
  isWithinDeliveryRadius,
  RESTAURANT_LOCATION 
} from '../../services/locationService';

const DeliveryFeeCalculator = ({ 
  userLocation, 
  className = "",
  showDetails = true 
}) => {
  const [deliveryInfo, setDeliveryInfo] = useState({
    distance: 0,
    fee: 0,
    estimatedTime: '',
    isWithinRadius: false
  });

  const feeStructure = {
    baseFee: 2.99,
    perKmFee: 0.50,
    maxFee: 8.99,
    freeDeliveryThreshold: 5, // km
    maxDeliveryRadius: 10 // km
  };

  useEffect(() => {
    if (userLocation?.coordinates) {
      calculateDeliveryInfo();
    }
  }, [userLocation]);

  const calculateDeliveryInfo = () => {
    if (!userLocation?.coordinates) return;

    const distance = calculateDistance(
      userLocation.coordinates, 
      RESTAURANT_LOCATION
    );
    
    const fee = calculateDeliveryFee(
      userLocation.coordinates,
      RESTAURANT_LOCATION,
      feeStructure
    );
    
    const estimatedTime = getEstimatedDeliveryTime(
      userLocation.coordinates,
      RESTAURANT_LOCATION
    );
    
    const isWithinRadius = isWithinDeliveryRadius(
      userLocation.coordinates,
      RESTAURANT_LOCATION,
      feeStructure.maxDeliveryRadius
    );

    setDeliveryInfo({
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      fee: Math.round(fee * 100) / 100, // Round to 2 decimals
      estimatedTime,
      isWithinRadius
    });
  };

  const getFeeDisplayColor = () => {
    if (!deliveryInfo.isWithinRadius) return 'text-red-600';
    if (deliveryInfo.fee === 0) return 'text-green-600';
    return 'text-gray-900';
  };

  const getFeeDisplayText = () => {
    if (!deliveryInfo.isWithinRadius) {
      return 'Delivery not available';
    }
    if (deliveryInfo.fee === 0) {
      return 'Free delivery';
    }
    return `$${deliveryInfo.fee.toFixed(2)}`;
  };

  if (!userLocation?.coordinates) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center text-gray-500">
          <FaMapMarkerAlt className="mr-2" />
          <span>Select a location to see delivery information</span>
        </div>
      </div>
    );
  }

  if (!deliveryInfo.isWithinRadius) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start">
          <FaTruck className="mr-3 mt-1 text-red-500" />
          <div>
            <h4 className="font-medium text-red-900">Delivery Not Available</h4>
            <p className="text-sm text-red-700 mt-1">
              We don't deliver to this location. Please select a location within {feeStructure.maxDeliveryRadius}km of our restaurant.
            </p>
            <p className="text-xs text-red-600 mt-2">
              Distance: {deliveryInfo.distance}km from restaurant
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <FaTruck className="mr-2 text-primary-500" />
            Delivery Information
          </h3>
          <div className="flex items-center space-x-2">
            {deliveryInfo.fee === 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Free Delivery
              </span>
            )}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Free Service
            </span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Delivery Fee */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${getFeeDisplayColor()}`}>
              {getFeeDisplayText()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Delivery Fee</div>
          </div>

          {/* Distance */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {deliveryInfo.distance}km
            </div>
            <div className="text-sm text-gray-500 mt-1">Distance</div>
          </div>

          {/* Estimated Time */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <FaClock className="mr-1" />
              {deliveryInfo.estimatedTime}
            </div>
            <div className="text-sm text-gray-500 mt-1">Est. Time</div>
          </div>
        </div>

        {/* Additional Details */}
        {showDetails && (
          <div className="border-t border-gray-200 pt-3">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Restaurant Location:</span>
                <span className="font-medium">{RESTAURANT_LOCATION.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Radius:</span>
                <span className="font-medium">{feeStructure.maxDeliveryRadius}km</span>
              </div>
              {deliveryInfo.fee > 0 && (
                <div className="flex items-center justify-between">
                  <span>Free delivery threshold:</span>
                  <span className="font-medium">{feeStructure.freeDeliveryThreshold}km</span>
                </div>
              )}
            </div>

            {/* Fee Breakdown */}
            {deliveryInfo.fee > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaInfoCircle className="mr-2 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Fee Breakdown</span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Base fee:</span>
                    <span>${feeStructure.baseFee}</span>
                  </div>
                  {deliveryInfo.distance > feeStructure.freeDeliveryThreshold && (
                    <div className="flex justify-between">
                      <span>Distance charge ({(deliveryInfo.distance - feeStructure.freeDeliveryThreshold).toFixed(1)}km × ${feeStructure.perKmFee}):</span>
                      <span>${((deliveryInfo.distance - feeStructure.freeDeliveryThreshold) * feeStructure.perKmFee).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-1 flex justify-between font-medium">
                    <span>Total delivery fee:</span>
                    <span>${deliveryInfo.fee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Free Service Notice */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <FaInfoCircle className="mr-2 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Powered by OpenStreetMap</p>
                  <p className="text-xs text-blue-700 mt-1">
                    This service uses free, open-source mapping data. No API keys or paid services required!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryFeeCalculator;