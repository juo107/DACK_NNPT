import axiosInstance from './axiosInstance';

/**
 * Authentication API Service
 * Endpoint: /api/v1/auth
 */
const authApi = {
  // Đăng nhập
  login: (credentials) => {
    // credentials: { username, password }
    const url = '/auth/login';
    return axiosInstance.post(url, credentials);
  },

  // Đăng ký
  register: (userData) => {
    // userData: { username, password, email }
    const url = '/auth/register';
    return axiosInstance.post(url, userData);
  },

  // Lấy thông tin người dùng hiện tại (dùng token)
  getMe: () => {
    const url = '/auth/me';
    return axiosInstance.get(url);
  },

  // Đăng xuất
  logout: () => {
    const url = '/auth/logout';
    return axiosInstance.post(url);
  }
};

export default authApi;
