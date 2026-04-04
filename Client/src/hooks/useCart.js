import { useCartContext } from '../context/CartContext';

/**
 * Custom Hook: useCart
 * Hiện tại đã chuyển sang sử dụng Global Context
 * Giúp đồng bộ dữ liệu toàn tập và tránh gọi API dư thừa.
 */
const useCart = () => {
    // Chỉ đơn giản là lấy dữ liệu từ Context đã được khởi tạo trong App.jsx
    return useCartContext();
};

export default useCart;
