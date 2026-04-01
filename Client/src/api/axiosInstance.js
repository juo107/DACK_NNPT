import axios from 'axios';

// Cấu hình URL cơ sở cho API của bạn
const BASE_URL = 'http://localhost:3000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // Cho phép gửi/nhận cookie từ Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Thêm Token vào Header nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi toàn cục
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Xử lý các lỗi HTTP phổ biến
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized - Vui lòng đăng nhập lại.');
          break;
        case 404:
          console.error('API endpoint không tồn tại.');
          break;
        case 500:
          console.error('Lỗi Server - Vui lòng thử lại sau.');
          break;
        default:
          console.error('Đã xảy ra lỗi:', error.response.data.message);
      }
    } else {
      console.error('Không thể kết nối đến Server.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
