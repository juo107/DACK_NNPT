import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers3, TrendingUp } from 'lucide-react';
import { Button } from 'antd';

const ProductsHero = ({ stats, onResetFilters }) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#ffffff_50%,#f8fafc_100%)]">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.18),transparent_25%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-accent" />
              Bộ sưu tập sản phẩm của NN Store
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-7xl">
              Khám phá sản phẩm
              <span className="block text-primary">theo phong cách của bạn.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Lọc nhanh theo tên, danh mục và mức giá để tìm đúng sản phẩm bạn cần. Trang này được thiết kế để
              chuyển từ duyệt sang chọn mua thật nhanh.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#product-grid"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition-transform hover:scale-[1.02] hover:bg-primary-hover"
              >
                Xem ngay
                <ArrowRight className="h-4 w-4" />
              </a>
              <Button
                onClick={onResetFilters}
                className="!h-12 !rounded-full !border-white/20 !bg-white/10 !px-6 !font-bold !text-white hover:!border-white/30 hover:!bg-white/15"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatCard label="Sản phẩm" value={String(stats.products).padStart(2, '0')} icon={TrendingUp} />
            <StatCard label="Danh mục" value={String(stats.categories).padStart(2, '0')} icon={Layers3} />
            <StatCard label="Giá trung bình" value={stats.averagePrice} icon={Sparkles} />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-3xl border border-slate-200/60 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">{label}</p>
        <div className="mt-2 text-xl font-black text-slate-900">{value}</div>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

export default ProductsHero;