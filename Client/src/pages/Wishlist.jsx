import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Empty, Skeleton } from 'antd';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import useWishlist from '../hooks/useWishlist';
import { formatCurrency, getImageUrl } from '../utils/productHelpers';

const Wishlist = () => {
  const { items, loading, isGuest, removeFromWishlist } = useWishlist();

  if (isGuest) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg text-center">
          <Heart className="mx-auto h-16 w-16 text-rose-200 mb-4" />
          <h1 className="text-2xl font-black text-slate-900">Yêu thích</h1>
          <p className="mt-2 text-slate-500 font-medium">Đăng nhập để xem sản phẩm đã lưu.</p>
          <Button
            type="primary"
            className="mt-8 !h-12 !rounded-xl font-black"
            onClick={() => window.dispatchEvent(new Event('openAuthModal'))}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại cửa hàng
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Yêu thích</h1>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-600 shadow-sm border border-slate-100">
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-[2.5rem] bg-white p-16 shadow-sm border border-slate-100 text-center">
            <Empty
              description={
                <span className="text-lg font-bold text-slate-400">Chưa có sản phẩm yêu thích</span>
              }
            />
            <Link to="/products">
              <Button type="primary" size="large" className="mt-6 !rounded-2xl font-black">
                Khám phá sản phẩm
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const product = item.product;
              const id = product?._id || product;
              if (!product) return null;
              return (
                <div
                  key={item._id}
                  className="group flex gap-4 rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                >
                  <Link to={`/products/${id}`} className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50">
                    <img
                      src={getImageUrl(product)}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/cat-sneakers.png';
                      }}
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to={`/products/${id}`}
                        className="line-clamp-2 font-black text-slate-900 hover:text-primary transition-colors"
                      >
                        {product.title}
                      </Link>
                      <div className="mt-2 text-lg font-black text-primary">{formatCurrency(product.price)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(id)}
                      className="self-end p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      aria-label="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
