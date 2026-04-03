import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import local banner images
import fashionBanner from '../../assets/fashion-banner.png';
import electronicsBanner from '../../assets/electronics-banner.png';
import homeBanner from '../../assets/home-banner.png';

// Import local card images
import cardFashion from '../../assets/card-fashion.png';
import cardDeals from '../../assets/card-deals.png';
import cardTech from '../../assets/card-tech.png';

const Hero = () => {
  const banners = [
    {
      id: 1,
      image: electronicsBanner,
      link: "/products?category=Electronics"
    },
    {
      id: 2,
      image: fashionBanner,
      link: "/products?category=Fashion"
    },
    {
      id: 3,
      image: homeBanner,
      link: "/products?category=Mobile"
    }
  ];

  const categoryCards = [
    {
      title: "Thời trang nam",
      image: cardFashion,
      link: "/products?category=Nam",
      label: "Xem thêm"
    },
    {
      title: "Ưu đãi Tết 2024",
      image: cardDeals,
      link: "/products?sale=true",
      label: "Mua ngay"
    },
    {
      title: "Phụ kiện công nghệ",
      image: cardTech,
      link: "/products?category=Phụ kiện",
      label: "Khám phá"
    },
    {
      title: "Đăng nhập để xem ưu đãi",
      isLogin: true,
      label: "Đăng nhập an toàn"
    }
  ];

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-4 cursor-pointer text-white/50 hover:text-white transition-colors"
        onClick={onClick}
      >
        <ChevronRight size={48} strokeWidth={1} />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 cursor-pointer text-white/50 hover:text-white transition-colors"
        onClick={onClick}
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </div>
    );
  };

  return (
    <section className="relative w-full bg-[#e3e6e6]">
      {/* Main Banner Carousel */}
      <div className="relative group">
        <Carousel 
          autoplay 
          arrows 
          nextArrow={<NextArrow />}
          prevArrow={<PrevArrow />}
          effect="fade"
          dots={false}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="relative h-[250px] sm:h-[400px] md:h-[600px] outline-none">
              <Link to={banner.link}>
                <img 
                  src={banner.image} 
                  alt="Banner" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e3e6e6] via-transparent to-transparent opacity-100 h-full"></div>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Content Cards - Spaced Down */}
      <div className="container mx-auto px-4 relative mt-28 z-20 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map((card, idx) => (
            <div key={idx} className="bg-white p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 h-14 overflow-hidden leading-tight">
                {card.title}
              </h2>
              
              {card.isLogin ? (
                <div className="flex-1 flex flex-col justify-center items-center gap-4 py-4">
                  <p className="text-sm text-gray-700 text-center">Tận hưởng trải nghiệm mua sắm tốt nhất của bạn</p>
                  <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2.5 rounded-lg text-sm font-medium border border-[#FCD200] shadow-sm">
                    {card.label}
                  </button>
                </div>
              ) : (
                <>
                  <Link to={card.link} className="flex-1 overflow-hidden mb-4 group">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <Link 
                    to={card.link} 
                    className="text-sm font-medium text-[#007185] hover:text-[#C7511F] hover:underline"
                  >
                    {card.label}
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
