import axiosInstance from './axiosInstance';

const wishlistApi = {
  getItems: () => axiosInstance.get('/wishlists'),
  add: (payload) => axiosInstance.post('/wishlists/add', payload),
  remove: (payload) => axiosInstance.post('/wishlists/remove', payload),
  clear: () => axiosInstance.post('/wishlists/clear'),
};

export default wishlistApi;
