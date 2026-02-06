import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getMenuItems,
  getMenuItemsByCategory,
  getMenuItem,
  createBooking,
  getUserBookings,
  saveCart,
  getCart,
  clearCart,
  createOrder,
  getUserOrders,
  saveDeliveryAddress,
  getDeliveryAddresses,
  listenToCart,
  listenToUserOrders
} from '../services/firestoreService';

const FirestoreContext = createContext();

export function useFirestore() {
  return useContext(FirestoreContext);
}

export function FirestoreProvider({ children }) {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [userBookings, setUserBookings] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState({ addresses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile when user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const result = await getUserProfile(currentUser.uid);
          if (result.success) {
            setUserProfile(result.data);
          } else {
            // Create profile if it doesn't exist
            const newProfile = {
              email: currentUser.email,
              profile: {
                name: currentUser.displayName || '',
                phone: '',
                preferences: {
                  dietaryRestrictions: [],
                  favoriteCategories: [],
                  defaultLocation: null,
                  deliveryPreferences: {
                    useCurrentLocation: false,
                    deliveryType: 'pickup',
                    autoLocation: false
                  }
                }
              }
            };
            const createResult = await createUserProfile(currentUser.uid, newProfile);
            if (createResult.success) {
              setUserProfile(newProfile);
            }
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [currentUser]);

  // Load menu items on component mount
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const result = await getMenuItems();
        if (result.success) {
          setMenuItems(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadMenuItems();
  }, []);

  // Load user cart when user changes
  useEffect(() => {
    if (currentUser) {
      const loadCart = async () => {
        try {
          const result = await getCart(currentUser.uid);
          if (result.success) {
            setCart(result.data);
          }
        } catch (err) {
          console.error('Error loading cart:', err);
        }
      };

      loadCart();
    } else {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem('perlasCart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          setCart({ items: items, total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) });
        } catch (e) {
          console.error('Failed to parse local cart:', e);
          setCart({ items: [], total: 0 });
        }
      } else {
        setCart({ items: [], total: 0 });
      }
    }
  }, [currentUser]);

  // Load user bookings when user changes
  useEffect(() => {
    if (currentUser) {
      const loadBookings = async () => {
        try {
          const result = await getUserBookings(currentUser.uid);
          if (result.success) {
            setUserBookings(result.data);
          }
        } catch (err) {
          console.error('Error loading bookings:', err);
        }
      };

      loadBookings();
    } else {
      setUserBookings([]);
    }
  }, [currentUser]);

  // Load user orders when user changes
  useEffect(() => {
    if (currentUser) {
      const loadOrders = async () => {
        try {
          const result = await getUserOrders(currentUser.uid);
          if (result.success) {
            setUserOrders(result.data);
          }
        } catch (err) {
          console.error('Error loading orders:', err);
        }
      };

      loadOrders();
    } else {
      setUserOrders([]);
    }
  }, [currentUser]);

  // Load delivery addresses when user changes
  useEffect(() => {
    if (currentUser) {
      const loadAddresses = async () => {
        try {
          const result = await getDeliveryAddresses(currentUser.uid);
          if (result.success) {
            setDeliveryAddresses(result.data);
          }
        } catch (err) {
          console.error('Error loading delivery addresses:', err);
        }
      };

      loadAddresses();
    } else {
      setDeliveryAddresses({ addresses: [] });
    }
  }, [currentUser]);

  // Real-time cart listener
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = listenToCart(currentUser.uid, (result) => {
        if (result.success) {
          setCart(result.data);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  // Real-time orders listener
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = listenToUserOrders(currentUser.uid, (result) => {
        if (result.success) {
          setUserOrders(result.data);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  // Menu operations
  const getMenuByCategory = async (category) => {
    try {
      const result = await getMenuItemsByCategory(category);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getSingleMenuItem = async (itemId) => {
    try {
      const result = await getMenuItem(itemId);
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // User profile operations
  const updateProfile = async (updates) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const result = await updateUserProfile(currentUser.uid, updates);
      if (result.success) {
        setUserProfile(prev => ({ ...prev, ...updates }));
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Cart synchronization logic
  const syncLocalCart = async (localItems) => {
    if (!currentUser || !localItems || localItems.length === 0) return;

    try {
      // Merge local items with existing Firestore items or just replace?
      // For now, if we are logging in, we'll merge them.
      // Getting existing cart first
      const currentCartResult = await getCart(currentUser.uid);
      let mergedItems = [];

      if (currentCartResult.success && currentCartResult.data.items) {
        const existingItems = currentCartResult.data.items;

        // Merge strategy: if item exists in both, use the larger quantity or local?
        // Let's go with local items take priority for now as they are the latest action.
        mergedItems = [...existingItems];

        localItems.forEach(localItem => {
          const index = mergedItems.findIndex(i => i.id === localItem.id);
          if (index > -1) {
            mergedItems[index].quantity = Math.max(mergedItems[index].quantity, localItem.quantity);
          } else {
            mergedItems.push(localItem);
          }
        });
      } else {
        mergedItems = localItems;
      }

      const result = await saveCart(currentUser.uid, mergedItems);
      if (result.success) {
        setCart(result.data);
        localStorage.removeItem('perlasCart'); // Clear local after successful sync
        return true;
      }
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
    return false;
  };

  // Auto-sync cart on login
  useEffect(() => {
    if (currentUser) {
      const savedCart = localStorage.getItem('perlasCart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          if (items && items.length > 0) {
            syncLocalCart(items);
          }
        } catch (e) {
          console.error('Failed to parse local cart:', e);
        }
      }
    }
  }, [currentUser]);

  // Cart operations
  const addToCart = async (item) => {
    try {
      const newItems = [...(cart.items || [])];
      const existingItem = newItems.find(i => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        newItems.push({ ...item, quantity: 1 });
      }

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newCart = { items: newItems, total: newTotal };

      if (currentUser) {
        const result = await saveCart(currentUser.uid, newItems);
        if (result.success) {
          setCart(newCart);
          return true;
        } else {
          throw new Error(result.error);
        }
      } else {
        // Guest mode
        setCart(newCart);
        localStorage.setItem('perlasCart', JSON.stringify(newItems));
        return true;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      let newItems = [...(cart.items || [])];
      if (quantity <= 0) {
        newItems = newItems.filter(item => item.id !== itemId);
      } else {
        const item = newItems.find(i => i.id === itemId);
        if (item) {
          item.quantity = quantity;
        }
      }

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newCart = { items: newItems, total: newTotal };

      if (currentUser) {
        const result = await saveCart(currentUser.uid, newItems);
        if (result.success) {
          setCart(newCart);
          return true;
        } else {
          throw new Error(result.error);
        }
      } else {
        // Guest mode
        setCart(newCart);
        localStorage.setItem('perlasCart', JSON.stringify(newItems));
        return true;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const newItems = (cart.items || []).filter(item => item.id !== itemId);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newCart = { items: newItems, total: newTotal };

      if (currentUser) {
        const result = await saveCart(currentUser.uid, newItems);
        if (result.success) {
          setCart(newCart);
          return true;
        } else {
          throw new Error(result.error);
        }
      } else {
        // Guest mode
        setCart(newCart);
        localStorage.setItem('perlasCart', JSON.stringify(newItems));
        return true;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearUserCart = async () => {
    try {
      if (currentUser) {
        const result = await clearCart(currentUser.uid);
        if (result.success) {
          setCart({ items: [], total: 0 });
          return true;
        } else {
          throw new Error(result.error);
        }
      } else {
        setCart({ items: [], total: 0 });
        localStorage.removeItem('perlasCart');
        return true;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Booking operations
  const createUserBooking = async (bookingData) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const result = await createBooking({
        ...bookingData,
        userId: currentUser.uid
      });
      if (result.success) {
        setUserBookings(prev => [result.data, ...prev]);
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Order operations
  const createUserOrder = async (orderData) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const result = await createOrder({
        ...orderData,
        userId: currentUser.uid
      });
      if (result.success) {
        setUserOrders(prev => [result.data, ...prev]);
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delivery address operations
  const saveUserAddress = async (addressData) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const result = await saveDeliveryAddress(currentUser.uid, addressData);
      if (result.success) {
        setDeliveryAddresses(result.data);
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    // State
    userProfile,
    menuItems,
    cart,
    userBookings,
    userOrders,
    deliveryAddresses,
    loading,
    error,

    // Menu operations
    getMenuByCategory,
    getSingleMenuItem,

    // User profile operations
    updateProfile,

    // Cart operations
    addToCart,
    updateCartItem,
    removeFromCart,
    clearUserCart,

    // Booking operations
    createUserBooking,

    // Order operations
    createUserOrder,

    // Delivery address operations
    saveUserAddress,

    // Cart sync
    syncLocalCart,

    // Utility
    setError
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}