import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Button, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import authApi from '../api/authApi';
import useCart from '../hooks/useCart';

const AuthModal = ({ open, onCancel, onLoginSuccess }) => {
  const { mergeGuestCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState('login');
  const [errorVisible, setErrorVisible] = useState('');

  // Xóa lỗi khi đổi Tab
  const handleTabChange = (key) => {
    setTabKey(key);
    setErrorVisible('');
  };

  // Xử lý đăng nhập
  const handleLogin = async (values) => {
    setLoading(true);
    setErrorVisible('');
    try {
      const token = await authApi.login(values);
      // 1. Lưu token để axiosInstance có thể dùng ngay
      localStorage.setItem('token', token);
      
      // 2. Lấy thông tin user thực tế
      const userData = await authApi.getMe();
      localStorage.setItem('user', JSON.stringify(userData));

      // 3. Đồng bộ ngay lập tức cho các Context đang lắng nghe
      window.dispatchEvent(new Event('userChanged'));

      // 4. HỢP NHẤT GIỎ HÀNG (Sử dụng logic tập trung từ Context)
      await mergeGuestCart();

      message.success('Đăng nhập thành công!');
      onLoginSuccess(userData);
      onCancel();
      
      // Reload sau một khoảng thời gian ngắn để đảm bảo trải nghiệm ổn định
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      setErrorVisible(error.response?.data || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (values) => {
    setLoading(true);
    setErrorVisible('');
    try {
      await authApi.register(values);
      message.success('Đăng ký thành công! Hãy đăng nhập.');
      setTabKey('login');
    } catch (error) {
      setErrorVisible(error.response?.data || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (values) => {
    setLoading(true);
    setErrorVisible('');
    try {
      await authApi.forgotPassword({ email: values.email });
      message.success('Nếu email tồn tại, hệ thống đã gửi mật khẩu mới. Kiểm tra hộp thư.');
      setTabKey('login');
    } catch (error) {
      setErrorVisible(error.response?.data || 'Gửi yêu cầu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={420}
      styles={{ body: { padding: '24px' } }}
    >
      <Tabs
        activeKey={tabKey}
        onChange={handleTabChange}
        centered
        items={[
          {
            key: 'login',
            label: 'Đăng nhập',
            children: (
              <div className="space-y-4 pt-2">
                {errorVisible && tabKey === 'login' && (
                  <Alert message={errorVisible} type="error" showIcon closable className="rounded-xl border-none bg-rose-50 text-rose-600 mb-4" />
                )}
                <Form onFinish={handleLogin} layout="vertical">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                  Đăng nhập
                </Button>
                <div className="text-center mt-2">
                  <button
                    type="button"
                    className="text-sm text-primary font-medium hover:underline bg-transparent border-0 cursor-pointer p-0"
                    onClick={() => handleTabChange('forgot')}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                </Form>
              </div>
            ),
          },
          {
            key: 'forgot',
            label: 'Quên mật khẩu',
            children: (
              <div className="space-y-4 pt-2">
                {errorVisible && tabKey === 'forgot' && (
                  <Alert message={errorVisible} type="error" showIcon closable className="rounded-xl border-none bg-rose-50 text-rose-600 mb-4" />
                )}
                <p className="text-sm text-gray-600 mb-2">
                  Nhập email đã đăng ký. Hệ thống sẽ tạo mật khẩu mới và gửi vào email.
                </p>
                <Form onFinish={handleForgot} layout="vertical">
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                    Gửi mật khẩu mới
                  </Button>
                </Form>
              </div>
            ),
          },
          {
            key: 'register',
            label: 'Đăng ký',
            children: (
              <div className="space-y-4 pt-2">
                {errorVisible && tabKey === 'register' && (
                  <Alert message={errorVisible} type="error" showIcon closable className="rounded-xl border-none bg-rose-50 text-rose-600 mb-4" />
                )}
                <Form onFinish={handleRegister} layout="vertical">
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
                  </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                  Tạo tài khoản
                </Button>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default AuthModal;
