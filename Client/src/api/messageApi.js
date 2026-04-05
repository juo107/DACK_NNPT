import axiosInstance from './axiosInstance';

const messageApi = {
  // Lấy danh sách tất cả các hội thoại gần nhất
  getConversations: () => {
    return axiosInstance.get('/messages');
  },

  // Lấy chi tiết lịch sử tin nhắn với 1 user cụ thể
  getMessages: (userId) => {
    return axiosInstance.get(`/messages/${userId}`);
  },

  // Gửi tin nhắn mới
  send: (payload) => {
    // Nếu payload có chứa file, hãy dùng FormData
    if (payload.file) {
      const formData = new FormData();
      formData.append('to', payload.to);
      if (payload.text) formData.append('text', payload.text);
      formData.append('file', payload.file);
      return axiosInstance.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    // Gửi text thông thường
    return axiosInstance.post('/messages', payload);
  }
};

export default messageApi;
