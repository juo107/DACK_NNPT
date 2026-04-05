import React, { useState, useCallback, useMemo } from 'react';
import { Space, Button, Typography, Tag, message, Popconfirm, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AdminTable from '../../components/admin/Table';
import AdminModal from '../../components/admin/Modal';
import categoryApi from '../../api/categoryApi';

const { Text } = Typography;

/**
 * Category Management Page
 * Standard CRUD using AdminTable and AdminModal
 */
const CategoryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableRef, setTableRef] = useState(null);

  const handleSetTableRef = useCallback((ref) => {
    setTableRef(ref);
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setModalMode('edit');
    setSelectedCategory(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoryApi.delete(id);
      message.success('Xóa danh mục thành công!');
      tableRef?.reload();
    } catch (error) {
      message.error('Không thể xóa danh mục này!');
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      if (modalMode === 'create') {
        await categoryApi.create(values);
        message.success('Thêm danh mục mới thành công!');
      } else {
        await categoryApi.update(selectedCategory._id, values);
        message.success('Cập nhật danh mục thành công!');
      }
      setIsModalOpen(false);
      tableRef?.reload();
    } catch (error) {
      message.error(error.response?.data?.message || 'Thao tác thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Đường dẫn (Slug)',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <Tag color="blue">{slug}</Tag>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          />
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              className="hover:scale-110 transition-transform"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Memoize apiService for AdminTable dependency safety
  const apiService = useMemo(() => ({
    getAll: () => categoryApi.getAll(),
    // Logic delete is handled in local handleDelete for better UX control
    delete: (id) => categoryApi.delete(id)
  }), []);

  return (
    <>
      <AdminTable
        title="Quản lý Danh mục"
        columns={columns}
        apiService={apiService}
        rowKey="_id"
        onAdd={handleOpenCreate}
        onRef={handleSetTableRef}
      />

      <AdminModal
        title={modalMode === 'create' ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
        open={isModalOpen}
        mode={modalMode}
        initialValues={selectedCategory}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleSave}
        loading={loading}
      >
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự!' }
          ]}
        >
          <Input placeholder="Ví dụ: Giày thể thao, Phụ kiện..." size="large" />
        </Form.Item>
      </AdminModal>
    </>
  );
};

export default CategoryManagement;
