import axiosInstance from './axiosInstance';

const reviewApi = {
    // Lấy review theo ID sản phẩm
    getByProductId: (productId) => {
        const url = `/reviews/product/${productId}`;
        return axiosInstance.get(url);
    },

    // Lấy tổng hợp đánh giá (sao trung bình, số lượng) để lọc sản phẩm
    getSummary: (params) => {
        const url = '/reviews/summary';
        return axiosInstance.get(url, { params });
    },

    // Gửi đánh giá sản phẩm
    add: (data) => {
        const url = '/reviews/add-review';
        return axiosInstance.post(url, data);
    }
};

export default reviewApi;
