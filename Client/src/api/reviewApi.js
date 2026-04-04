import axiosInstance from './axiosInstance';

const reviewApi = {
    // Lấy review theo ID sản phẩm
    getByProductId: (productId) => {
        const url = `/reviews/product/${productId}`;
        return axiosInstance.get(url);
    },

    // Gửi đánh giá sản phẩm
    add: (data) => {
        const url = '/reviews/add-review';
        return axiosInstance.post(url, data);
    }
};

export default reviewApi;
