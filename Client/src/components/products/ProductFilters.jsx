import React from 'react';
import { Button, Input, Select, Slider, Space } from 'antd';
import { Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  priceCeiling,
  categoryOptions,
  onApply,
  onReset,
}) => {
  return (
    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">Bộ lọc</h2>
          <p className="text-sm text-slate-500">Tìm sản phẩm phù hợp nhất</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Tìm kiếm</label>
          <Input
            prefix={<Search className="h-4 w-4 text-slate-400" />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tên sản phẩm..."
            className="!h-12 !rounded-2xl"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Danh mục</label>
          <Select
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            className="w-full"
            size="large"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Sắp xếp</label>
          <Select
            value={sortBy}
            onChange={setSortBy}
            className="w-full"
            size="large"
            options={[
              { value: 'featured', label: 'Nổi bật' },
              { value: 'newest', label: 'Mới nhất' },
              { value: 'price-asc', label: 'Giá tăng dần' },
              { value: 'price-desc', label: 'Giá giảm dần' },
            ]}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Khoảng giá</span>
            <span className="text-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}
            </span>
          </div>
          <Slider
            range
            min={0}
            max={priceCeiling}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>

        <Space orientation="vertical" className="w-full" size={12}>
          <Button
            type="primary"
            icon={<ShoppingBag className="h-4 w-4" />}
            className="!h-12 !w-full !rounded-2xl !bg-slate-900 hover:!bg-primary"
            onClick={onApply}
          >
            Áp dụng bộ lọc
          </Button>
          <Button
            icon={<X className="h-4 w-4" />}
            className="!h-12 !w-full !rounded-2xl"
            onClick={onReset}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </div>
    </aside>
  );
};

export default ProductFilters;