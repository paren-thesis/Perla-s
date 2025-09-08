import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// ==================== USER OPERATIONS ====================

/**
 * Create or update user profile
 * @param {string} userId - Firebase Auth UID
 * @param {Object} userData - User profile data
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userRef, userDoc, { merge: true });
    return { success: true, data: userDoc };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile
 * @param {string} userId - Firebase Auth UID
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 * @param {string} userId - Firebase Auth UID
 * @param {Object} updates - Fields to update
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// ==================== MENU OPERATIONS ====================

/**
 * Get all menu items
 */
export const getMenuItems = async () => {
  try {
    const menuRef = collection(db, 'menuItems');
    const q = query(menuRef, orderBy('category'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: menuItems };
  } catch (error) {
    console.error('Error getting menu items:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get menu items by category
 * @param {string} category - Menu category
 */
export const getMenuItemsByCategory = async (category) => {
  try {
    const menuRef = collection(db, 'menuItems');
    const q = query(
      menuRef,
      where('category', '==', category),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: menuItems };
  } catch (error) {
    console.error('Error getting menu items by category:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get single menu item
 * @param {string} itemId - Menu item ID
 */
export const getMenuItem = async (itemId) => {
  try {
    const itemRef = doc(db, 'menuItems', itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      return { success: true, data: { id: itemSnap.id, ...itemSnap.data() } };
    } else {
      return { success: false, error: 'Menu item not found' };
    }
  } catch (error) {
    console.error('Error getting menu item:', error);
    return { success: false, error: error.message };
  }
};

// ==================== BOOKING OPERATIONS ====================

/**
 * Create a new booking
 * @param {Object} bookingData - Booking information
 */
export const createBooking = async (bookingData) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const bookingDoc = {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(bookingsRef, bookingDoc);
    return { success: true, data: { id: docRef.id, ...bookingDoc } };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's bookings
 * @param {string} userId - Firebase Auth UID
 */
export const getUserBookings = async (userId) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: bookings };
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, error: error.message };
  }
};

// ==================== CART OPERATIONS ====================

/**
 * Save user's cart
 * @param {string} userId - Firebase Auth UID
 * @param {Array} cartItems - Cart items
 */
export const saveCart = async (userId, cartItems) => {
  try {
    const cartRef = doc(db, 'cart', userId);
    const cartData = {
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(cartRef, cartData, { merge: true });
    return { success: true, data: cartData };
  } catch (error) {
    console.error('Error saving cart:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's cart
 * @param {string} userId - Firebase Auth UID
 */
export const getCart = async (userId) => {
  try {
    const cartRef = doc(db, 'cart', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      return { success: true, data: cartSnap.data() };
    } else {
      return { success: true, data: { items: [], total: 0 } };
    }
  } catch (error) {
    console.error('Error getting cart:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear user's cart
 * @param {string} userId - Firebase Auth UID
 */
export const clearCart = async (userId) => {
  try {
    const cartRef = doc(db, 'cart', userId);
    await setDoc(cartRef, {
      items: [],
      total: 0,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }
};

// ==================== ORDER OPERATIONS ====================

/**
 * Create a new order
 * @param {Object} orderData - Order information
 */
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, 'orders');
    const orderDoc = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(ordersRef, orderDoc);
    return { success: true, data: { id: docRef.id, ...orderDoc } };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's orders
 * @param {string} userId - Firebase Auth UID
 */
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: orders };
  } catch (error) {
    console.error('Error getting user orders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

// ==================== DELIVERY ADDRESS OPERATIONS ====================

/**
 * Save delivery address
 * @param {string} userId - Firebase Auth UID
 * @param {Object} addressData - Address information
 */
export const saveDeliveryAddress = async (userId, addressData) => {
  try {
    const addressRef = doc(db, 'deliveryAddresses', userId);
    const addressDoc = {
      ...addressData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(addressRef, addressDoc, { merge: true });
    return { success: true, data: addressDoc };
  } catch (error) {
    console.error('Error saving delivery address:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's delivery addresses
 * @param {string} userId - Firebase Auth UID
 */
export const getDeliveryAddresses = async (userId) => {
  try {
    const addressRef = doc(db, 'deliveryAddresses', userId);
    const addressSnap = await getDoc(addressRef);
    
    if (addressSnap.exists()) {
      return { success: true, data: addressSnap.data() };
    } else {
      return { success: true, data: { addresses: [] } };
    }
  } catch (error) {
    console.error('Error getting delivery addresses:', error);
    return { success: false, error: error.message };
  }
};

// ==================== REAL-TIME LISTENERS ====================

/**
 * Listen to user's cart changes
 * @param {string} userId - Firebase Auth UID
 * @param {Function} callback - Callback function
 */
export const listenToCart = (userId, callback) => {
  const cartRef = doc(db, 'cart', userId);
  return onSnapshot(cartRef, (doc) => {
    if (doc.exists()) {
      callback({ success: true, data: doc.data() });
    } else {
      callback({ success: true, data: { items: [], total: 0 } });
    }
  });
};

/**
 * Listen to user's orders
 * @param {string} userId - Firebase Auth UID
 * @param {Function} callback - Callback function
 */
export const listenToUserOrders = (userId, callback) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    callback({ success: true, data: orders });
  });
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert Firestore timestamp to JavaScript Date
 * @param {Object} timestamp - Firestore timestamp
 */
export const convertTimestamp = (timestamp) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

/**
 * Convert JavaScript Date to Firestore timestamp
 * @param {Date} date - JavaScript Date
 */
export const convertToTimestamp = (date) => {
  return Timestamp.fromDate(date);
};