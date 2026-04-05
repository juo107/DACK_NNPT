import axiosInstance from './axiosInstance';

/**
 * Inventory API Service
 * Endpoint: /api/v1/inventories
 */
const inventoryApi = {
  // Get all inventories
  getAll: () => {
    const url = '/inventories';
    return axiosInstance.get(url);
  },

  // Get inventory for a specific product (Public Route)
  getByProductId: (productId) => {
    const url = `/inventories/product/${productId}`;
    return axiosInstance.get(url);
  },

  // Add stock: {product, quantity}
  addStock: (productId, quantity) => {
    const url = '/inventories/add-stock';
    return axiosInstance.post(url, { product: productId, quantity: Number(quantity) });
  },

  // Remove stock: {product, quantity}
  removeStock: (productId, quantity) => {
    const url = '/inventories/remove-stock';
    return axiosInstance.post(url, { product: productId, quantity: Number(quantity) });
  },

  // Reservation: {product, quantity}
  reservation: (productId, quantity) => {
    const url = '/inventories/reservation';
    return axiosInstance.post(url, { product: productId, quantity: Number(quantity) });
  },

  // Sold: {product, quantity}
  sold: (productId, quantity) => {
    const url = '/inventories/sold';
    return axiosInstance.post(url, { product: productId, quantity: Number(quantity) });
  }
};

export default inventoryApi;
