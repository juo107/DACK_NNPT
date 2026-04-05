import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rate, Spin, message } from 'antd';
import productApi from '../../api/productApi';
import { formatCurrency } from '../../utils/productHelpers';
import useCart from '../../hooks/useCart';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Lấy danh sách sản phẩm từ API
        const response = await productApi.getAll();
        // Giả sử API trả về mảng trực tiếp hoặc trong response.data
        const data = response.data || response;
        
        // Map dữ liệu từ API sang định dạng của Component
        const filteredData = data.slice(0, 8).map(item => {
          let imageUrl = '/assets/cat-sneakers.png'; // Mặc định
          
          if (item.images && item.images.length > 0) {
            const firstImage = item.images[0];
            // Nếu là URL tuyệt đối hoặc base64 thì giữ nguyên
            if (firstImage.startsWith('http') || firstImage.startsWith('data:')) {
              imageUrl = firstImage;
            } else {
              // Nếu là đường dẫn tương đối từ backend (ví dụ: /uploads/abc.jpg)
              const backendBaseUrl = 'http://localhost:3000';
              imageUrl = firstImage.startsWith('/') ? `${backendBaseUrl}${firstImage}` : `${backendBaseUrl}/${firstImage}`;
            }
          }

          return {
            id: item._id,
            name: item.title,
            price: item.price,
            salePrice: item.salePrice || null,
            rating: item.rating || 5,
            image: imageUrl,
            tag: item.tag || (item.salePrice ? 'Sale' : null),
            category: item.category?.name || 'Sản phẩm',
            apiProduct: item,
          };
        });

        setProducts(filteredData);
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Gợi ý cho bạn</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow p-2">
              <Link to={`/products/${product.id}`} className="flex-shrink-0 aspect-square w-full overflow-hidden rounded bg-gray-100 mb-2">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.src = '/assets/cat-sneakers.png'; }}
                />
              </Link>
              
              <div className="px-2 flex-1 flex flex-col">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                
                <div className="mt-1 flex items-center gap-1">
                  <Rate disabled defaultValue={product.rating} className="text-[10px]" />
                </div>
                
                <div className="mt-2 flex items-baseline gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-base font-bold text-gray-900 truncate">
                        {formatCurrency(product.salePrice)}
                      </span>
                      <span className="text-xs text-gray-400 line-through truncate">
                        {formatCurrency(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-bold text-gray-900 truncate">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={addingId === product.id}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!product.apiProduct?._id) return;
                    setAddingId(product.id);
                    try {
                      await addItem(product.apiProduct, 1);
                    } finally {
                      setAddingId(null);
                    }
                  }}
                  className="mt-2 w-full py-1.5 bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-gray-900 font-semibold text-sm rounded transition-colors"
                >
                  {addingId === product.id ? 'Đang thêm…' : 'Thêm vào giỏ'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 py-4 border-t border-gray-200 text-center">
          <Link to="/products" className="text-blue-600 font-semibold hover:text-blue-700">
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

