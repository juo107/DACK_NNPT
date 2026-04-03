/**
 * Định dạng tiền tệ theo chuẩn Việt Nam (VND)
 * @param {number} price - Giá sản phẩm (ví dụ: 1500000)
 * @returns {string} - Chuỗi định dạng (ví dụ: 1.500.000 ₫)
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
