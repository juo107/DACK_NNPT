import axiosInstance from './axiosInstance';

const cartApi = {
  getItems: () => axiosInstance.get('/carts'),
  add: (payload) => axiosInstance.post('/carts/add', payload),
  remove: (payload) => axiosInstance.post('/carts/remove', payload),
  // Delete entire cart (For logged in user)
  clear: () => {
    const url = '/carts/clear';
    return axiosInstance.post(url);
  }
};

export default cartApi;