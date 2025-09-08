import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const loadOrders = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getUserOrders(params);
      setOrders(response.orders || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.createOrder(orderData);
      
      // Reload orders to include the new one
      await loadOrders();
      
      return {
        success: true,
        order: response.order,
        message: 'Order placed successfully!'
      };
    } catch (err) {
      console.error('Error creating order:', err);
      throw {
        success: false,
        message: err.message || 'Failed to place order',
        code: err.status
      };
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.cancelOrder(id);
      
      // Reload orders to reflect changes
      await loadOrders();
      
      return {
        success: true,
        order: response.order,
        message: 'Order cancelled successfully!'
      };
    } catch (err) {
      console.error('Error cancelling order:', err);
      throw {
        success: false,
        message: err.message || 'Failed to cancel order',
        code: err.status
      };
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (id) => {
    try {
      const response = await apiClient.getOrder(id);
      return response.order;
    } catch (err) {
      console.error('Error loading order:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    pagination,
    loadOrders,
    createOrder,
    cancelOrder,
    getOrder,
    refetch: () => loadOrders()
  };
}