import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Menu, Avatar, Space, message, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined, SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Search, ShoppingBag, User, Menu as MenuIcon, X } from 'lucide-react';
import AuthModal from './AuthModal';
import useCart from '../hooks/useCart';

/**
 * Component: Header
 * UI Layer (Presentation)
 * Sử dụng useCart hook để hiển thị số lượng giỏ hàng thực tế (Guest/Member)
 */
const Header = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // -- Hooks --
  const { items } = useCart();
  const cartCount = items.length;

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    // Lắng nghe sự kiện mở AuthModal từ các trang khác
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('userChanged'));
    setUser(null);
    message.success('Đã đăng xuất!');
    // Reload để hook useCart nhận biết user đã null và resetting toàn bộ state
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const userMenuItems = [
    { key: 'profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
    { key: 'myOrders', label: <Link to="/my-orders">Đơn mua của tôi</Link>, icon: <ShoppingBag className="w-4 h-4" /> },
    { key: 'admin', label: <Link to="/admin/products">Quản trị</Link>, icon: <DownOutlined /> },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center mr-4">
            <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-1 group">
              <span className="bg-primary text-white px-2 py-0.5 rounded transition-transform group-hover:scale-105">NN</span>
              <span className="text-gray-900 group-hover:text-primary transition-colors">STORE</span>
            </Link>
          </div>

          {/* Search Bar - Amazon Style */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
              }}
              className="flex w-full group"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm trên NN STORE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-4 pr-12 rounded-l-md border-2 border-transparent bg-gray-100 focus:bg-white focus:border-orange-400 focus:outline-none transition-all placeholder:text-gray-500 font-medium"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-5 bg-orange-400 hover:bg-orange-500 text-gray-900 rounded-r-md transition-colors flex items-center justify-center cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center gap-8">
              <li><Link to="/" className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors">Trang chủ</Link></li>
              <li><Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Sản phẩm</Link></li>
              <li><Link to="/news" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Tin tức</Link></li>
              <li><Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Liên hệ</Link></li>
            </ul>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors md:hidden">
              <Search className="w-5 h-5" />
            </button>
            
            <Link to="/cart" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative group">
              <Badge count={cartCount} offset={[5, -5]} size="small" color="orange" className="font-bold">
                <ShoppingBag className="w-6 h-6 group-hover:text-primary transition-colors" />
              </Badge>
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

            <div className="auth-section">
              {user ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                  <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 hover:bg-gray-50 rounded-full transition-colors">
                    <Avatar src={user.avatar} icon={<UserOutlined />} className="bg-primary/10 text-primary border border-primary/20" />
                    <span className="text-sm font-semibold hidden md:inline-block text-gray-800">{user.username}</span>
                  </div>
                </Dropdown>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
                >
                  Đăng nhập
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 flex flex-col space-y-4 px-6 animate-in slide-in-from-top-4 duration-300">
          <Link to="/" className="text-lg font-semibold py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
          <Link to="/products" className="text-lg font-semibold py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Sản phẩm</Link>
          <Link to="/news" className="text-lg font-semibold py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Tin tức</Link>
          <Link to="/contact" className="text-lg font-semibold py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Liên hệ</Link>
        </div>
      )}

      <AuthModal 
        open={isAuthOpen} 
        onCancel={() => setIsAuthOpen(false)} 
        onLoginSuccess={(userData) => { setUser(userData); setIsAuthOpen(false); }}
      />
    </header>
  );
};

export default Header;
