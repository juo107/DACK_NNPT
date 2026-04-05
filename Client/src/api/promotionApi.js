import axiosInstance from './axiosInstance';

const promotionApi = {
    getAll: (params) => {
        const url = '/promotions';
        return axiosInstance.get(url, { params });
    },

    getById: (id) => {
        const url = `/promotions/${id}`;
        return axiosInstance.get(url);
    },

    validate: (code) => {
        const url = `/promotions/validate/${code}`;
        return axiosInstance.get(url);
    },

    add: (data) => {
        const url = '/promotions';
        return axiosInstance.post(url, data);
    },

    update: (id, data) => {
        const url = `/promotions/${id}`;
        return axiosInstance.put(url, data);
    },

    delete: (id) => {
        const url = `/promotions/${id}`;
        return axiosInstance.delete(url);
    },
};

export default promotionApi;
