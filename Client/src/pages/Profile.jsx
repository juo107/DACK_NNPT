import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Descriptions, message, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import authApi from '../api/authApi';

const strongPwdHint =
  'Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (theo yêu cầu server).';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdForm] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Vui lòng đăng nhập.');
      navigate('/');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await authApi.getMe();
        if (!cancelled) {
          setUser(me);
          localStorage.setItem('user', JSON.stringify(me));
          window.dispatchEvent(new Event('userChanged'));
        }
      } catch {
        if (!cancelled) navigate('/');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const onChangePassword = async (values) => {
    setPwdLoading(true);
    try {
      await authApi.changePassword({
        oldpassword: values.oldpassword,
        newpassword: values.newpassword,
      });
      message.success('Đổi mật khẩu thành công!');
      pwdForm.resetFields();
    } catch {
      /* axiosInstance đã hiển thị lỗi từ server */
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Tài khoản</h1>

        <Card className="rounded-2xl shadow-sm border border-gray-100 mb-6" title="Thông tin cá nhân">
          <Descriptions column={1} size="middle">
            <Descriptions.Item label="Tên đăng nhập">
              <UserOutlined className="mr-2 text-gray-400" />
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <MailOutlined className="mr-2 text-gray-400" />
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">{user.role?.name || '—'}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-gray-100" title="Đổi mật khẩu">
          <Alert type="info" showIcon className="mb-4" message={strongPwdHint} />
          <Form form={pwdForm} layout="vertical" onFinish={onChangePassword}>
            <Form.Item
              name="oldpassword"
              label="Mật khẩu hiện tại"
              rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="newpassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Nhập mật khẩu mới' },
                { min: 8, message: 'Tối thiểu 8 ký tự' },
              ]}
              extra={strongPwdHint}
            >
              <Input.Password prefix={<LockOutlined />} size="large" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Nhập lại mật khẩu mới"
              dependencies={['newpassword']}
              rules={[
                { required: true, message: 'Xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newpassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Không khớp với mật khẩu mới'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={pwdLoading} block>
              Cập nhật mật khẩu
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
