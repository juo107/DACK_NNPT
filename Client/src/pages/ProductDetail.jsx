import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Button, Empty, Skeleton, Tag, message } from 'antd';
import { ArrowLeft, Heart, ShoppingBag, Star } from 'lucide-react';
import productApi from '../api/productApi';
import cartApi from '../api/cartApi';
import { formatCurrency, getImageUrl } from '../utils/productHelpers';

const normalizeOptionArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return [];
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [detailResponse, listResponse] = await Promise.all([
          productApi.getById(id),
          productApi.getAll(),
        ]);

        const detail = detailResponse?.data || detailResponse;
        const list = Array.isArray(listResponse) ? listResponse : listResponse?.data || [];

        if (!detail) {
          setError('Sản phẩm không tồn tại hoặc đã bị xóa.');
          return;
        }

        setProduct(detail);
        setProducts(list);
      } catch (fetchError) {
        setError('Không thể tải chi tiết sản phẩm.');
        message.error('Không thể tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
  const stock = Number(product?.stock || 50);
  const sizeOptions = normalizeOptionArray(product?.sizes || product?.sizeOptions);
  const colorOptions = normalizeOptionArray(product?.colors || product?.colorOptions);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Alert message={error || 'Không tìm thấy sản phẩm'} type="warning" showIcon />
        <div className="mt-6">
          <Link to="/products" className="text-primary font-semibold hover:underline">
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const increaseQty = () => setQuantity((prev) => Math.min(prev + 1, stock));
  const decreaseQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = async () => {
    if (!product?._id) return;

    try {
      setAddingCart(true);
      await cartApi.add({ product: product._id, quantity });

      const optionSummary = [selectedSize && `Size ${selectedSize}`, selectedColor && `Mau ${selectedColor}`]
        .filter(Boolean)
        .join(', ');

      message.success(
        optionSummary
          ? `Da them ${quantity} san pham vao gio - ${optionSummary}`
          : `Da them ${quantity} san pham vao gio`
      );
    } catch (cartError) {
      if (cartError?.response?.status === 401) {
        message.warning('Vui long dang nhap de them vao gio hang');
      } else if (cartError?.response?.status === 404) {
        message.error('Khong the them vao gio. Kiem tra ton kho/inventory cua backend.');
      } else {
        message.error('Them vao gio that bai');
      }
    } finally {
      setAddingCart(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4">
            <img
              src={imageUrl}
              alt={product?.title}
              className="h-[420px] w-full rounded-2xl object-cover lg:h-[560px]"
              onError={(event) => {
                event.currentTarget.src = '/assets/cat-sneakers.png';
              }}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Tag color="blue">{product?.category?.name || 'Chưa phân loại'}</Tag>
              <Tag color="green">{product?.sku || 'SKU chưa có'}</Tag>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">
              {product?.title}
            </h1>

            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
              <Star className="h-4 w-4 fill-current" />
              {Number(product?.rating || 5).toFixed(1)}
            </div>

            <div className="mt-6 border-y border-slate-100 py-6">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Giá bán</div>
              <div className="mt-2 text-4xl font-black text-primary">{formatCurrency(product?.price)}</div>
            </div>

            <p className="mt-6 leading-8 text-slate-600">
              {product?.description || 'Sản phẩm này chưa có mô tả chi tiết.'}
            </p>

            <div className="mt-6 space-y-5 border-t border-slate-100 pt-6">
              {sizeOptions.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Kich co</div>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 min-w-10 rounded-xl border px-4 text-sm font-semibold transition ${
                          selectedSize === size
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {colorOptions.length > 0 && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mau sac</div>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                          selectedColor === color
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">So luong</div>
                <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200">
                  <button type="button" onClick={decreaseQty} className="h-10 w-10 border-r border-slate-200 text-lg">-</button>
                  <div className="flex h-10 min-w-12 items-center justify-center px-3 font-bold">{quantity}</div>
                  <button type="button" onClick={increaseQty} className="h-10 w-10 border-l border-slate-200 text-lg">+</button>
                </div>
                <div className="mt-2 text-sm text-slate-500">Ton kho: {stock}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button
                type="primary"
                loading={addingCart}
                onClick={handleAddToCart}
                className="!h-12 !rounded-2xl !bg-slate-900 hover:!bg-primary"
                icon={<ShoppingBag className="h-4 w-4" />}
              >
                Thêm vào giỏ
              </Button>
              <Button className="!h-12 !rounded-2xl" icon={<Heart className="h-4 w-4" />}>
                Thêm yêu thích
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Sản phẩm liên quan</h2>

          {relatedProducts.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-10">
              <Empty description="Chưa có sản phẩm liên quan" />
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={getImageUrl(item)}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = '/assets/cat-sneakers.png';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-base font-bold text-slate-900">{item.title}</h3>
                    <div className="mt-2 text-lg font-black text-primary">{formatCurrency(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;