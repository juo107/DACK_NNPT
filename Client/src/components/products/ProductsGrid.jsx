import React from 'react';
import { Empty, Pagination, Spin, Tag } from 'antd';
import ProductCard from './ProductCard';

const ProductsGrid = ({
  products,
  loading,
  total,
  currentPage,
  pageSize,
  priceCeiling,
  searchTerm,
  category,
  priceRange,
  formatCurrency,
  getImageUrl,
  onPageChange,
  onSelectProduct,
}) => {
  return (
    <div id="product-grid">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Danh sách sản phẩm</h2>
          <p className="mt-1 text-sm text-slate-500">
            Hiển thị {total} kết quả phù hợp với bộ lọc hiện tại.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {category !== 'all' && <Tag color="blue">Danh mục đã lọc</Tag>}
          {searchTerm && <Tag color="geekblue">Từ khóa: {searchTerm}</Tag>}
          {(priceRange[0] !== 0 || priceRange[1] !== priceCeiling) && <Tag color="purple">Giá tùy chỉnh</Tag>}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
          <Spin size="large" tip="Đang tải sản phẩm..." />
        </div>
      ) : total === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20">
          <Empty description="Không tìm thấy sản phẩm phù hợp" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                formatCurrency={formatCurrency}
                getImageUrl={getImageUrl}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger={false}
              onChange={onPageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsGrid;