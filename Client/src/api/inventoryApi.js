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

  // Get inventory for a specific product
  // Note: Backend might need a specific search or the inventories list can be filtered
  getByProductId: (productId) => {
    // Current backend logic: GET /inventories returns all with populated product.
    // We filter on the frontend for now, or use a specific endpoint if added.
    const url = '/inventories';
    return axiosInstance.get(url).then(response => {
      const list = response.data || response;
      return list.find(inv => inv.product?._id === productId || inv.product === productId);
    });
  }
};

export default inventoryApi;
