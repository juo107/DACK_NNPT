import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Drawer, Tag } from 'antd';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductDrawer = ({ product, formatCurrency, getImageUrl, onClose }) => {
  return (
    <Drawer
      title={product?.title || 'Chi tiết sản phẩm'}
      size="large"
      open={Boolean(product)}
      onClose={onClose}
      destroyOnClose
    >
      {product && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            <img
              src={getImageUrl(product)}
              alt={product?.title}
              className="h-80 w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = '/assets/cat-sneakers.png';
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag color="blue">{product?.category?.name || 'Chưa phân loại'}</Tag>
            <Tag color="green">{product?.sku || 'SKU chưa có'}</Tag>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Giá</div>
            <div className="mt-2 text-3xl font-black text-slate-900">{formatCurrency(product?.price)}</div>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            {product?.description || 'Sản phẩm này chưa có mô tả chi tiết.'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Button type="primary" icon={<ShoppingBag className="h-4 w-4" />} className="!h-12 !rounded-2xl !bg-slate-900 hover:!bg-primary">
              Thêm vào giỏ
            </Button>
            <Button icon={<Heart className="h-4 w-4" />} className="!h-12 !rounded-2xl">
              Yêu thích
            </Button>
          </div>

          <Link
            to={`/products/${product?._id}`}
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Mở trang chi tiết
          </Link>

          <Button onClick={onClose} className="!h-11 !w-full !rounded-2xl">
            Đóng
          </Button>
        </div>
      )}
    </Drawer>
  );
};

export default ProductDrawer;