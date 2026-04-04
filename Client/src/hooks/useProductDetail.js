import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import productApi from '../api/productApi';
import inventoryApi from '../api/inventoryApi';
import { getImageUrl } from '../utils/productHelpers';

const normalizeOptionArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return [];
};

/**
 * Custom Hook: useProductDetail
 * Quản lý logic cho trang Chi tiết sản phẩm
 * Tập trung vào việc Fetch và quản lý thuộc tính sản phẩm (Size, Color, Qty)
 */
const useProductDetail = (productId) => {
  // -- States --
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // -- Fetch Data --
  const fetchData = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      setError('');

      const [detailResponse, listResponse, inventoryData, reviewResponse] = await Promise.all([
        productApi.getById(productId),
        productApi.getAll(),
        inventoryApi.getByProductId(productId),
        productApi.getReviews(productId)
      ]);

      const detail = detailResponse?.data || detailResponse;
      const list = Array.isArray(listResponse) ? listResponse : listResponse?.data || [];
      const reviewData = reviewResponse?.data || reviewResponse || {};

      if (!detail) {
        setError('Sản phẩm không tồn tại hoặc đã bị xóa.');
        return;
      }

      setProduct(detail);
      setProducts(list);
      setInventory(inventoryData);
      setReviews(Array.isArray(reviewData.reviews) ? reviewData.reviews : []);
      setReviewCount(Number(reviewData.reviewCount || detail.reviewCount || 0));
      setAverageRating(Number(reviewData.averageRating || detail.averageRating || 0));
    } catch (fetchError) {
      setError('Không thể tải chi tiết sản phẩm.');
      message.error('Không thể tải chi tiết sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  // -- Computed Values (Memoized) --
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const categoryId = product?.category?._id || product?.category;
    return products
      .filter((item) => {
        const itemCategoryId = item?.category?._id || item?.category;
        return item?._id !== product?._id && itemCategoryId === categoryId;
      })
      .slice(0, 4);
  }, [product, products]);

  const imageUrl = getImageUrl(product);
  const stock = inventory ? inventory.stock : Number(product?.stock || 0);
  const sizeOptions = normalizeOptionArray(product?.sizes || product?.sizeOptions);
  const colorOptions = normalizeOptionArray(product?.colors || product?.colorOptions);

  // -- Effects --
  useEffect(() => {
    if (sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0]);
    } else {
      setSelectedSize('');
    }

    if (colorOptions.length > 0) {
      setSelectedColor(colorOptions[0]);
    } else {
      setSelectedColor('');
    }
  }, [product?._id, sizeOptions, colorOptions]);

  // -- Handlers --
  const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, stock));
  const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return {
    product,
    inventory,
    loading,
    error,
    imageUrl,
    stock,
    sizeOptions,
    colorOptions,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity,
    increaseQty,
    decreaseQty,
    relatedProducts,
    reviews,
    reviewCount,
    averageRating,
    setReviews,
    setReviewCount,
    setAverageRating
  };
};

export default useProductDetail;
