import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import productApi from '../api/productApi';
import { formatCurrency, getImageUrl, normalizeText } from '../utils/productHelpers';

const PAGE_SIZE = 12;

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceCeiling, setPriceCeiling] = useState(10000000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll();
        const data = Array.isArray(response) ? response : response?.data || [];

        setProducts(data);

        const maxPrice = data.reduce((max, product) => {
          const price = Number(product?.price || 0);
          return price > max ? price : max;
        }, 0);

        const upperBound = maxPrice > 0 ? maxPrice : 10000000;
        setPriceCeiling(upperBound);
        setPriceRange([0, upperBound]);
      } catch (error) {
        message.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Map();

    products.forEach((product) => {
      const categoryId = product?.category?._id || product?.category || 'uncategorized';
      const categoryName = product?.category?.name || 'Chưa phân loại';

      if (!uniqueCategories.has(categoryId)) {
        uniqueCategories.set(categoryId, {
          value: categoryId,
          label: categoryName,
        });
      }
    });

    return [{ value: 'all', label: 'Tất cả danh mục' }, ...uniqueCategories.values()];
  }, [products]);

  const stats = useMemo(() => {
    const categoryCount = new Set(
      products.map((product) => product?.category?._id || product?.category?.name || 'uncategorized')
    ).size;

    const averagePrice = products.length
      ? products.reduce((sum, product) => sum + Number(product?.price || 0), 0) / products.length
      : 0;

    return {
      products: products.length,
      categories: categoryCount,
      averagePrice: formatCurrency(averagePrice),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = normalizeText(searchTerm);

    const result = products.filter((product) => {
      const title = normalizeText(product?.title);
      const productCategoryId = product?.category?._id || product?.category || 'uncategorized';
      const productPrice = Number(product?.price || 0);

      const matchesTitle = !keyword || title.includes(keyword);
      const matchesCategory = category === 'all' || productCategoryId === category;
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

      return matchesTitle && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case 'price-asc':
        return result.sort((left, right) => Number(left?.price || 0) - Number(right?.price || 0));
      case 'price-desc':
        return result.sort((left, right) => Number(right?.price || 0) - Number(left?.price || 0));
      case 'newest':
        return result.sort((left, right) => new Date(right?.createdAt || 0) - new Date(left?.createdAt || 0));
      default:
        return result;
    }
  }, [category, priceRange, products, searchTerm, sortBy]);

  const pagedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category, priceRange, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setSortBy('featured');
    setPriceRange([0, priceCeiling]);
    setCurrentPage(1);
  };

  return {
    products,
    loading,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    selectedProduct,
    setSelectedProduct,
    currentPage,
    setCurrentPage,
    priceCeiling,
    categoryOptions,
    stats,
    filteredProducts,
    pagedProducts,
    resetFilters,
    pageSize: PAGE_SIZE,
    formatCurrency,
    getImageUrl,
  };
};

export default useProducts;