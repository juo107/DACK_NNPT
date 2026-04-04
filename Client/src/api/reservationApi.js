import axiosInstance from './axiosInstance';

/**
 * Reservation API Service
 * Endpoint: /api/v1/reservations
 */
const reservationApi = {
  // Create a reservation (Buy Now)
  create: (data) => {
    // data: { product, quantity }
    const url = '/reservations';
    return axiosInstance.post(url, data);
  },

  // Get current user's reservations
  getMyReservations: () => {
    const url = '/reservations';
    return axiosInstance.get(url);
  },

  // Cancel reservation
  cancel: (id) => {
    const url = `/reservations/cancel/${id}`;
    return axiosInstance.put(url);
  },

  // Mark as paid
  pay: (id) => {
    const url = `/reservations/paid/${id}`;
    return axiosInstance.put(url);
  },

  // --- ADMIN METHODS ---
  
  // Get all reservations (Admin)
  getAllAdmin: () => {
    const url = '/reservations/admin/all';
    return axiosInstance.get(url);
  },

  // Update status (Admin)
  updateStatusAdmin: (id, status) => {
    const url = `/reservations/admin/status/${id}`;
    return axiosInstance.put(url, { status });
  },

  // Delete reservation (Admin)
  deleteAdmin: (id) => {
    const url = `/reservations/admin/${id}`;
    return axiosInstance.delete(url);
  }
};

export default reservationApi;
