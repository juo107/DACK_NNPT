import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import authApi from '../api/authApi';

const AuthModal = ({ open, onCancel, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState('login');

  // Xử lý đăng nhập
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      // Lưu thông tin user vào localStorage (Backend trả về info user)
      localStorage.setItem('user', JSON.stringify(response));
      message.success('Đăng nhập thành công!');
      onLoginSuccess(response);
      onCancel(); // Đóng modal
    } catch (error) {
      message.error(error.response?.data || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await authApi.register(values);
      message.success('Đăng ký thành công! Hãy đăng nhập.');
      setTabKey('login'); // Chuyển sang tab đăng nhập
    } catch (error) {
      message.error(error.response?.data || 'Đăng ký thất bại!');
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
      width={400}
      styles={{ body: { padding: '24px' } }}
    >
      <Tabs
        activeKey={tabKey}
        onChange={setTabKey}
        centered
        items={[
          {
            key: 'login',
            label: 'Đăng nhập',
            children: (
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
              </Form>
            ),
          },
          {
            key: 'register',
            label: 'Đăng ký',
            children: (
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
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default AuthModal;
