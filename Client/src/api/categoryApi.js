import axiosInstance from './axiosInstance';

const categoryApi = {
  // Lấy tất cả danh mục
  getAll: () => {
    const url = '/categories';
    return axiosInstance.get(url);
  },

  // Lấy chi tiết danh mục
  getById: (id) => {
    const url = `/categories/${id}`;
    return axiosInstance.get(url);
  }
};

export default categoryApi;
