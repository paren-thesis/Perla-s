import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const loadBookings = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getUserBookings(params);
      setBookings(response.bookings || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createBooking(bookingData);
      
      // Reload bookings to include the new one
      await loadBookings();
      
      return {
        success: true,
        booking: response.booking,
        message: 'Booking created successfully!'
      };
    } catch (err) {
      console.error('Error creating booking:', err);
      throw {
        success: false,
        message: err.message || 'Failed to create booking',
        code: err.status
      };
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.updateBooking(id, updateData);
      
      // Reload bookings to reflect changes
      await loadBookings();
      
      return {
        success: true,
        booking: response.booking,
        message: 'Booking updated successfully!'
      };
    } catch (err) {
      console.error('Error updating booking:', err);
      throw {
        success: false,
        message: err.message || 'Failed to update booking',
        code: err.status
      };
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.cancelBooking(id);
      
      // Reload bookings to reflect changes
      await loadBookings();
      
      return {
        success: true,
        booking: response.booking,
        message: 'Booking cancelled successfully!'
      };
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw {
        success: false,
        message: err.message || 'Failed to cancel booking',
        code: err.status
      };
    } finally {
      setLoading(false);
    }
  };

  const getBooking = async (id) => {
    try {
      const response = await apiClient.getBooking(id);
      return response.booking;
    } catch (err) {
      console.error('Error loading booking:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    pagination,
    loadBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    getBooking,
    refetch: () => loadBookings()
  };
}