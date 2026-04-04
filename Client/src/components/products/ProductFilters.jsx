import React, { useState } from 'react';
import { Button, Input, Select, Slider } from 'antd';
import { ChevronDown, Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';

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
  const [open, setOpen] = useState(false);

  const priceFmt = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 sm:px-5 sm:py-4"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black text-slate-900 sm:text-lg">Bộ lọc sản phẩm</span>
            <span className="block text-xs text-slate-500 sm:text-sm">
              {open ? 'Thu gọn' : 'Nhấn để mở tìm kiếm và lọc'}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-slate-100">
            <div className="bg-gradient-to-br from-slate-50 to-white px-4 py-4 sm:px-5 sm:py-4">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                <Input
                  prefix={<Search className="h-4 w-4 text-slate-400" />}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm theo tên sản phẩm..."
                  allowClear
                  className="!h-10 !rounded-xl sm:!h-11 sm:flex-1"
                  onPressEnter={onApply}
                />
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="primary"
                    icon={<ShoppingBag className="h-4 w-4" />}
                    className="!h-10 !flex-1 !rounded-xl !bg-slate-900 !px-4 !font-bold hover:!bg-primary sm:!h-11 sm:!flex-none sm:!px-5"
                    onClick={onApply}
                  >
                    Áp dụng
                  </Button>
                  <Button
                    type="default"
                    icon={<X className="h-4 w-4" />}
                    className="!h-10 !rounded-xl sm:!h-11"
                    onClick={onReset}
                    title="Xóa bộ lọc"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3 sm:p-5">
              <div className="min-w-0">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Danh mục
                </label>
                <Select
                  showSearch
                  allowClear
                  placeholder="Gõ để tìm danh mục..."
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? '')
                      .toLowerCase()
                      .includes(input.trim().toLowerCase())
                  }
                  value={category}
                  onChange={(v) => setCategory(v ?? 'all')}
                  options={categoryOptions}
                  className="w-full"
                  size="large"
                  popupMatchSelectWidth={false}
                />
              </div>
              <div className="min-w-0">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Sắp xếp
                </label>
                <Select
                  showSearch
                  placeholder="Gõ để tìm kiểu sắp xếp..."
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? '')
                      .toLowerCase()
                      .includes(input.trim().toLowerCase())
                  }
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
            </div>

            <div className="mx-4 mb-4 rounded-xl border border-slate-100 bg-slate-50/90 px-4 py-3 sm:mx-5 sm:mb-5 sm:px-5 sm:py-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Khoảng giá</span>
                <span className="text-sm font-black text-primary tabular-nums">
                  {priceFmt(priceRange[0])} – {priceFmt(priceRange[1])}
                </span>
              </div>
              <Slider
                range
                min={0}
                max={priceCeiling}
                value={priceRange}
                onChange={setPriceRange}
                tooltip={{ formatter: (v) => priceFmt(v) }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFilters;
