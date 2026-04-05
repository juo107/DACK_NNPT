import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  DatabaseOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    // Xử lý đăng xuất (nếu cần) và chuyển về trang quản trị
    navigate('/');
  };

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '/admin/orders',
      icon: <UnorderedListOutlined />,
      label: <Link to="/admin/orders">Đơn hàng</Link>,
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Sản phẩm</Link>,
    },
    {
      key: '/admin/promotions',
      icon: <GiftOutlined />,
      label: <Link to="/admin/promotions">Khuyến mãi</Link>,
    },
    {
      key: '/admin/categories',
      icon: <DatabaseOutlined />,
      label: <Link to="/admin/categories">Danh mục</Link>,
    },
    {
      key: '/admin/inventories',
      icon: <DatabaseOutlined />,
      label: <Link to="/admin/inventories">Kho hàng</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Về trang chủ</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-sm">
        <div className="flex items-center justify-center h-16 border-b border-gray-100">
          <Link to="/admin/products" className="text-xl font-black tracking-tighter flex items-center gap-1">
            <span className="bg-primary text-white px-2 py-0.5 rounded">NN</span>
            {!collapsed && <span className="text-gray-900">ADMIN</span>}
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="mt-4 border-none"
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: '24px',
          }}
          className="shadow-sm z-10"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <div className="flex items-center gap-4">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Avatar icon={<UserOutlined />} className="bg-primary" />
                <span className="font-semibold text-gray-700 hidden sm:inline">Quản trị viên</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'initial',
          }}
          className="shadow-sm"
        >
          {/* Outlet là nơi render các route con của /admin */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
