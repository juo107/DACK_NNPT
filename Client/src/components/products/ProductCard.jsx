import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Tag } from 'antd';
import { Heart, Search, ShoppingBag, Star } from 'lucide-react';

const ProductCard = ({ product, formatCurrency, getImageUrl, onSelectProduct }) => {
  const navigate = useNavigate();
  const imageUrl = getImageUrl(product);
  const categoryName = product?.category?.name || 'Chưa phân loại';
  const detailPath = `/products/${product?._id}`;

  const openDetail = () => {
    if (product?._id) {
      navigate(detailPath);
      return;
    }

    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
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
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
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

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-3 bg-gradient-to-t from-slate-950/80 to-transparent p-5 transition-transform duration-300 group-hover:translate-y-0">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
              <Heart className="h-4 w-4" />
            </span>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
              <Search className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-primary">
              {product?.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              <Star className="h-3 w-3 fill-current" /> 5.0
            </div>
          </div>

          <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
            {product?.description || 'Chưa có mô tả cho sản phẩm này.'}
          </p>

          <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Giá bán</div>
              <div className="mt-1 text-2xl font-black text-slate-900">{formatCurrency(product?.price)}</div>
            </div>
            <Button
              type="primary"
              className="!h-11 !rounded-full !bg-slate-900 !px-5 !font-bold hover:!bg-primary"
              onClick={(event) => {
                event.stopPropagation();
                openDetail();
              }}
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 -mt-2">
        <Link
          to={detailPath}
          className="text-sm font-semibold text-primary hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          Xem trang chi tiết
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;