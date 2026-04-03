import React from 'react';
import { Link } from 'react-router-dom';
import { 
  InstagramOutlined, 
  TwitterOutlined, 
  YoutubeFilled 
} from '@ant-design/icons';
import { Mail, Phone, MapPin, Send } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-1">
              <span className="bg-white text-gray-900 px-2 py-0.5 rounded">NN</span>
              <span>STORE</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              NN Store là thương hiệu thời trang tối giản hàng đầu, 
              mang đến những sản phẩm chất lượng cao với thiết kế tinh tế và hiện đại.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <InstagramOutlined className="text-lg text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <TwitterOutlined className="text-lg text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <YoutubeFilled className="text-lg text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-primary">Liên kết nhanh</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link to="/news" className="text-gray-400 hover:text-white transition-colors">Tin tức & Sự kiện</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Về chúng tôi</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-primary">Hỗ trợ khách hàng</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Chính sách giao hàng</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Đổi trả & Hoàn tiền</Link></li>
              <li><Link to="/warranty" className="text-gray-400 hover:text-white transition-colors">Bảo hành sản phẩm</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-8 uppercase tracking-widest text-primary">Bản tin</h4>
            <p className="text-gray-400 text-sm mb-6">Đăng ký để nhận thông tin về bộ sưu tập mới và ưu đãi độc quyền.</p>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors pr-12"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5" />
                <span className="text-sm font-medium">0987 654 321</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span className="text-sm font-medium">contact@nnstore.vn</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">236/106/1A Điện Biên Phủ, P. 17, Bình Thạnh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} NN STORE. All rights reserved. 
            <span className="hidden sm:inline mx-2 text-white/5">|</span>
            <span className="text-white/20">Designed by NNPTUD Team</span>
          </p>
          <div className="flex gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="h-6 w-auto bg-white/10 px-2 flex items-center justify-center rounded">VISA</div>
            <div className="h-6 w-auto bg-white/10 px-2 flex items-center justify-center rounded">MASTERCARD</div>
            <div className="h-6 w-auto bg-white/10 px-2 flex items-center justify-center rounded">MOMO</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

