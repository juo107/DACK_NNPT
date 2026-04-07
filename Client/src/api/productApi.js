import axiosInstance from './axiosInstance';

const productApi = {
  // Lấy tất cả sản phẩm
  getAll: (params) => {
    const url = '/products';
    return axiosInstance.get(url, { params });
  },

  // Lấy chi tiết sản phẩm theo ID
  getById: (id) => {
    const url = `/products/${id}`;
    return axiosInstance.get(url);
  },

  // Thêm mới sản phẩm
  add: (data) => {
    const url = '/products';
    return axiosInstance.post(url, data);
  },

  // Cập nhật sản phẩm
  update: (id, data) => {
    const url = `/products/${id}`;
    return axiosInstance.put(url, data);
  },

  // Xóa sản phẩm
  delete: (id) => {
    const url = `/products/${id}`;
    return axiosInstance.delete(url);
  },

  // Lấy danh sách đánh giá theo sản phẩm
  getReviews: (id) => {
    const url = `/products/${id}/reviews`;
    return axiosInstance.get(url);
  },

  // Gửi đánh giá sản phẩm (1-5 sao + nhận xét)
  submitReview: (id, data) => {
    const url = `/products/${id}/reviews`;
    return axiosInstance.post(url, data);
  },

  // Xóa đánh giá sản phẩm
  deleteReview: (id, reviewId) => {
    const url = `/products/${id}/reviews/${reviewId}`;
    return axiosInstance.delete(url);
  },

  // Cập nhật đánh giá sản phẩm
  updateReview: (id, reviewId, data) => {
    const url = `/products/${id}/reviews/${reviewId}`;
    return axiosInstance.put(url, data);
  },
};

export default productApi;
