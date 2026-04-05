import axiosInstance from './axiosInstance';

/**
 * Category API Service
 * Endpoint: /api/v1/categories
 */
const categoryApi = {
  // Get all categories
  getAll: () => {
    const url = '/categories';
    return axiosInstance.get(url);
  },

  // Get category by ID
  getById: (id) => {
    const url = `/categories/${id}`;
    return axiosInstance.get(url);
  },

  // Create new category
  create: (data) => {
    const url = '/categories';
    return axiosInstance.post(url, data);
  },

  // Update category
  update: (id, data) => {
    const url = `/categories/${id}`;
    return axiosInstance.put(url, data);
  },

  // Delete category (Soft delete)
  delete: (id) => {
    const url = `/categories/${id}`;
    return axiosInstance.delete(url);
  }
};

export default categoryApi;
