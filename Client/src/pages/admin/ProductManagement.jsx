import React from 'react';
import { Space, Button, Image, Tag, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminTable from '../../components/admin/Table';
import productApi from '../../api/productApi';

const ProductManagement = () => {
  // Logic xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await productApi.delete(id);
      message.success('Đã xóa sản phẩm thành công!');
      // AdminTable sẽ tự động load lại dữ liệu thông qua apiService.delete
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa!');
    }
  };

  // Cấu hình các cột riêng cho Product
  const productColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      width: 120,
      render: (images) => (
        <Image
          width={80}
          height={80}
          src={images && images.length > 0 ? images[0] : 'https://placehold.co/80x80?text=No+Image'}
          fallback="https://placehold.co/80x80?text=Error"
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span style={{ fontWeight: '600' }}>{text}</span>,
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </span>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue" style={{ borderRadius: '12px', padding: '0 12px' }}>
          {category?.name || 'Chưa phân loại'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => message.info(`Đang phát triển tính năng sửa cho: ${record.title}`)}
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-management">
      <AdminTable 
        title="Quản lý Sản phẩm"
        columns={productColumns}
        apiService={productApi}
        rowKey="_id"
      />
    </div>
  );
};

export default ProductManagement;
