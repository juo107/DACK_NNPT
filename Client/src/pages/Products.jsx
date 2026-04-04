import React from 'react';
import ProductsHero from '../components/products/ProductsHero';
import ProductFilters from '../components/products/ProductFilters';
import ProductsGrid from '../components/products/ProductsGrid';
import ProductDrawer from '../components/products/ProductDrawer';
import useProducts from '../hooks/useProducts';

const Products = () => {
  const {
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
    pageSize,
    formatCurrency,
    getImageUrl,
  } = useProducts();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <ProductsHero stats={stats} onResetFilters={resetFilters} />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:self-start">
            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              category={category}
              setCategory={setCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              priceCeiling={priceCeiling}
              categoryOptions={categoryOptions}
              onApply={() => setCurrentPage(1)}
              onReset={resetFilters}
            />
          </aside>

          <div className="min-w-0">
            <ProductsGrid
              products={pagedProducts}
              loading={loading}
              total={filteredProducts.length}
              currentPage={currentPage}
              pageSize={pageSize}
              priceCeiling={priceCeiling}
              searchTerm={searchTerm}
              category={category}
              priceRange={priceRange}
              formatCurrency={formatCurrency}
              getImageUrl={getImageUrl}
              onPageChange={setCurrentPage}
              onSelectProduct={setSelectedProduct}
            />
          </div>
        </div>
      </section>

      <ProductDrawer
        product={selectedProduct}
        formatCurrency={formatCurrency}
        getImageUrl={getImageUrl}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Products;