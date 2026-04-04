import axios from 'axios';
import { message } from 'antd';

// Dev: qua proxy Vite (/api -> localhost:3000) để tránh CORS + withCredentials.
// Build: đặt VITE_API_BASE=http://localhost:3000/api/v1 (hoặc URL server thật).
const BASE_URL =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3000/api/v1');

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
          message.warning('Vui lòng đăng nhập lại.');
          break;
        case 404:
          message.error('Không tìm thấy tài nguyên (404).');
          break;
        case 500:
          message.error('Lỗi Server hệ thống (500).');
          break;
        default:
          {
            const data = error.response.data;
            const errMsg = typeof data === 'string' 
              ? data 
              : (data?.message || (Array.isArray(data) ? 'Dữ liệu không hợp lệ' : 'Lỗi không xác định'));
            message.error(errMsg);
            console.error('Lỗi phản hồi:', errMsg);
          }
          break;
      }
    } else {
      console.error('Không thể kết nối đến Server.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
