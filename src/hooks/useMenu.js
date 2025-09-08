import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

export function useMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMenuItems = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMenuItems(params);
      setMenuItems(response.menuItems || []);
    } catch (err) {
      console.error('Error loading menu items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiClient.getMenuCategories();
      setCategories(response.categories || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const getMenuItem = async (id) => {
    try {
      const response = await apiClient.getMenuItem(id);
      return response.menuItem;
    } catch (err) {
      console.error('Error loading menu item:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadMenuItems();
    loadCategories();
  }, []);

  return {
    menuItems,
    categories,
    loading,
    error,
    loadMenuItems,
    loadCategories,
    getMenuItem,
    refetch: () => loadMenuItems()
  };
}