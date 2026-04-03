import axiosInstance from './axiosInstance';

const cartApi = {
  getItems: () => axiosInstance.get('/carts'),
  add: (payload) => axiosInstance.post('/carts/add', payload),
  remove: (payload) => axiosInstance.post('/carts/remove', payload),
};

export default cartApi;