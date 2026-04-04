import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag } from 'antd';
import { Heart, Search, ShoppingBag, Star } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

const ProductCard = ({ product, formatCurrency, getImageUrl, onSelectProduct }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const imageUrl = getImageUrl(product);
  const categoryName = product?.category?.name || 'Chưa phân loại';
  const detailPath = `/products/${product?._id}`;
  const inWishlist = product?._id ? isInWishlist(product._id) : false;

  const openDetail = () => {
    if (product?._id) {
      navigate(detailPath);
      return;
    }

    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleWishlistClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!product?._id) return;
    await toggleWishlist(product._id);
  };

  const handleAddToCartClick = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!product?._id) return;
    await addItem(product, 1);
  };

  const handleQuickViewClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      openDetail();
    }
  };

  return (
    <article className="group flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div
        onClick={openDetail}
        className="block w-full text-left"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetail();
          }
        }}
      >
        <div className="relative aspect-[4/5] shrink-0 overflow-hidden rounded-t-[2rem] bg-slate-100">
          <img
            src={imageUrl}
            alt={product?.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = '/assets/cat-sneakers.png';
            }}
          />

          <div className="absolute left-4 top-4 flex gap-2">
            <Tag color="blue" className="!rounded-full !px-3 !py-1 !text-xs !font-bold">
              {categoryName}
            </Tag>
            {product?.isDeleted && (
              <Tag color="red" className="!rounded-full !px-3 !py-1 !text-xs !font-bold">
                Ngưng bán
              </Tag>
            )}
          </div>

          <div
            className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-3 bg-gradient-to-t from-slate-950/80 to-transparent p-5 transition-transform duration-300 group-hover:translate-y-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              aria-label={inWishlist ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition-transform hover:scale-105"
              onClick={handleWishlistClick}
            >
              <Heart
                className={`h-4 w-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
            <button
              type="button"
              aria-label="Thêm vào giỏ hàng"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
              onClick={handleAddToCartClick}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={onSelectProduct ? 'Xem nhanh' : 'Xem chi tiết'}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition-transform hover:scale-105"
              onClick={handleQuickViewClick}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col space-y-4 p-5 pb-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 min-w-0 text-lg font-bold leading-snug">
              {product?._id ? (
                <Link
                  to={detailPath}
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-900 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {product?.title}
                </Link>
              ) : (
                <span className="text-slate-900">{product?.title}</span>
              )}
            </h3>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              <Star className="h-3 w-3 fill-current" /> 5.0
            </div>
          </div>

          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
            {product?.description || 'Chưa có mô tả cho sản phẩm này.'}
          </p>

          <div className="mt-auto border-t border-slate-100 pt-5">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Giá bán</div>
              <div className="mt-1 break-words text-xl font-black text-slate-900 sm:text-2xl">
                {formatCurrency(product?.price)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;