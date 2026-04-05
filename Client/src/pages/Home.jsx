import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Promotions from '../components/home/Promotions';

const Home = () => {
  return (
    <main className="min-h-screen bg-[#e3e6e6] overflow-x-hidden pb-12">
      {/* Hero Section with Amazon Style Carousel & Cards */}
      <Hero />

      {/* Promotions Section */}
      <div className="container mx-auto px-4 mt-6">
        <Promotions />
      </div>

      {/* Featured Products Section - Now on Gray Background */}
      <div className="container mx-auto px-4">
        <FeaturedProducts />
      </div>

      {/* Trust Badges - Styled to fit Amazon theme */}
      <section className="py-12 bg-white mt-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center group">
              <div className="text-3xl mb-3 transition-transform group-hover:scale-110">🚚</div>
              <h4 className="font-bold text-gray-900">Giao hàng miễn phí</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Cho đơn từ 500k</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="text-3xl mb-3 transition-transform group-hover:scale-110">🔄</div>
              <h4 className="font-bold text-gray-900">Đổi trả 30 ngày</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Dễ dàng, nhanh chóng</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="text-3xl mb-3 transition-transform group-hover:scale-110">🛡️</div>
              <h4 className="font-bold text-gray-900">Bảo mật thanh toán</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">100% An toàn</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="text-3xl mb-3 transition-transform group-hover:scale-110">💬</div>
              <h4 className="font-bold text-gray-900">Hỗ trợ 24/7</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Tận tâm, chu đáo</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

