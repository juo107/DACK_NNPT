import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu, Avatar, Space, message } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import AuthModal from './AuthModal';

const Header = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    message.success('Đã đăng xuất!');
  };

  const menuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header" style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          <Link to="/" style={{ color: 'inherit' }}>
            NNPTUD <span style={{ color: 'var(--text-main)' }}>Client</span>
          </Link>
        </div>
        
        <nav>
          <ul style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <li><Link to="/" style={{ fontWeight: '500' }}>Home</Link></li>
            <li><Link to="/admin/products" style={{ color: 'var(--text-muted)' }}>Admin Products</Link></li>
            <li><Link to="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link></li>
          </ul>
        </nav>

        <div className="auth-section">
          {user ? (
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--primary)' }} />
                <span style={{ fontWeight: '600' }}>{user.username}</span>
                <DownOutlined style={{ fontSize: '12px' }} />
              </Space>
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              className="btn-primary" 
              onClick={() => setIsAuthOpen(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      <AuthModal 
        open={isAuthOpen} 
        onCancel={() => setIsAuthOpen(false)} 
        onLoginSuccess={(userData) => setUser(userData)}
      />
    </header>
  );
};

export default Header;
