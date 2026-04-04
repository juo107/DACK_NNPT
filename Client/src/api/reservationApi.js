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
  }
};

export default reservationApi;
