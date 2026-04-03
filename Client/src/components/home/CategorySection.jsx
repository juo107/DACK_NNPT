import React from 'react';
import { ArrowRight } from 'lucide-react';

const categories = [
  { id: 1, name: 'Nam', image: '/assets/cat-hoodie.png', count: 280 },
  { id: 2, name: 'Nữ', image: '/assets/cat-trousers.png', count: 320 },
  { id: 3, name: 'Giày dép', image: '/assets/cat-access.png', count: 180 },
  { id: 4, name: 'Phụ kiện', image: '/assets/cat-sneakers.png', count: 220 },
];

const CategorySection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">DANH MỤC SẢN PHẨM</h2>
            <p className="text-gray-500 text-lg">Hàng ngàn sản phẩm chất lượng cao được phân loại rõ ràng, dễ tìm kiếm.</p>
          </div>
          <button className="flex items-center gap-2 font-bold text-primary group mt-6 md:mt-0">
            Xem tất cả danh mục <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="group relative h-[450px] overflow-hidden rounded-2xl bg-gray-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-sm font-bold text-white/60 mb-1 uppercase bg-white/10 backdrop-blur-md px-3 py-1 rounded inline-block">
                  {cat.count} Sản phẩm
                </div>
                <h3 className="text-2xl font-black text-white tracking-wider group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-white font-bold">
                  Khám phá ngay <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
