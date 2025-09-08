import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaHome, FaBuilding, FaMapPin } from 'react-icons/fa';
import { useFirestore } from '../../contexts/FirestoreContext';
import { useAuth } from '../../contexts/AuthContext';
import LocationPicker from './LocationPicker';

const DeliveryAddressManager = ({ 
  onAddressSelect, 
  selectedAddressId = null,
  showAddButton = true,
  className = ""
}) => {
  const { deliveryAddresses, saveUserAddress } = useFirestore();
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (deliveryAddresses.addresses) {
      setAddresses(deliveryAddresses.addresses);
    }
  }, [deliveryAddresses]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowLocationPicker(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowLocationPicker(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!currentUser) return;
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setIsLoading(true);
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
        await saveUserAddress({ addresses: updatedAddresses });
        setAddresses(updatedAddresses);
      } catch (error) {
        setError('Failed to delete address');
        console.error('Delete address error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLocationSelect = async (locationData) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError('');

      const newAddress = {
        id: editingAddress?.id || `addr_${Date.now()}`,
        label: editingAddress?.label || 'New Address',
        address: locationData.address,
        coordinates: locationData.coordinates,
        isDefault: editingAddress?.isDefault || addresses.length === 0,
        createdAt: editingAddress?.createdAt || new Date().toISOString()
      };

      let updatedAddresses;
      if (editingAddress) {
        // Update existing address
        updatedAddresses = addresses.map(addr => 
          addr.id === editingAddress.id ? newAddress : addr
        );
      } else {
        // Add new address
        updatedAddresses = [...addresses, newAddress];
      }

      await saveUserAddress({ addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      setShowLocationPicker(false);
      setEditingAddress(null);
    } catch (error) {
      setError('Failed to save address');
      console.error('Save address error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));

      await saveUserAddress({ addresses: updatedAddresses });
      setAddresses(updatedAddresses);
    } catch (error) {
      setError('Failed to set default address');
      console.error('Set default error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    onAddressSelect(address);
  };

  const getAddressIcon = (label) => {
    switch (label.toLowerCase()) {
      case 'home':
        return <FaHome className="text-blue-500" />;
      case 'work':
        return <FaBuilding className="text-green-500" />;
      default:
        return <FaMapPin className="text-gray-500" />;
    }
  };

  const formatAddress = (address) => {
    const parts = address.split(',');
    return {
      main: parts[0]?.trim() || '',
      details: parts.slice(1).join(',').trim()
    };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-primary-500" />
          Delivery Addresses
        </h3>
        {showAddButton && (
          <button
            onClick={handleAddAddress}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <FaPlus className="mr-2" />
            Add Address
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaMapMarkerAlt className="mx-auto text-4xl mb-4 text-gray-300" />
            <p>No delivery addresses saved</p>
            <p className="text-sm">Add an address to get started</p>
          </div>
        ) : (
          addresses.map((address) => {
            const formatted = formatAddress(address.address);
            const isSelected = selectedAddressId === address.id;
            
            return (
              <div
                key={address.id}
                className={`border rounded-lg p-4 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getAddressIcon(address.label)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{address.label}</h4>
                        {address.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 mt-1">{formatted.main}</p>
                      {formatted.details && (
                        <p className="text-sm text-gray-500">{formatted.details}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>
                          {address.coordinates.lat.toFixed(4)}, {address.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Set as default"
                      >
                        <FaCheck />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEditAddress(address)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit address"
                    >
                      <FaEdit />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete address"
                    >
                      <FaTrash />
                    </button>
                    
                    {!isSelected && (
                      <button
                        onClick={() => handleAddressSelect(address)}
                        className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={editingAddress}
        title={editingAddress ? "Edit Address" : "Add New Address"}
      />
    </div>
  );
};

export default DeliveryAddressManager;