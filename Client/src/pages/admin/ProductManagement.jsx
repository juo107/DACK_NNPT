import React, { useState, useCallback, useEffect } from 'react';
import { Space, Button, Image, Tag, Popconfirm, message, Form, Input, InputNumber, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import AdminTable from '../../components/admin/Table';
import AdminModal from '../../components/admin/Modal';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';

const { Option } = Select;

const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableRef, setTableRef] = useState(null);
  const [categories, setCategories] = useState([]);

  // Lấy danh sách danh mục để đổ vào Select
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  // Dùng useCallback để tránh render loop khi truyền ref vào AdminTable
  const handleSetTableRef = useCallback((ref) => {
    setTableRef(ref);
  }, []);

  // Mở modal để thêm mới
  const handleAdd = () => {
    setSelectedProduct({
      images: [],
      status: true,
      price: 0,
      salePrice: 0
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Mở modal để xem hoặc sửa
  const handleOpenModal = (record, mode) => {
    // Format lại dữ liệu trước khi đưa vào form để Select và TextArea hoạt động đúng
    const formattedRecord = {
      ...record,
      category: record.category?._id || record.category,
      images: Array.isArray(record.images) ? record.images.join(', ') : record.images
    };
    setSelectedProduct(formattedRecord);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // Logic xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await productApi.delete(id);
      message.success('Đã xóa sản phẩm thành công!');
      tableRef?.reload();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa!');
    }
  };

  // Logic lưu sản phẩm
  const handleSave = async (values) => {
    setLoading(true);
    try {
      // Xử lý biến images từ string (nếu nhập nhiều link cách nhau bởi dấu phẩy)
      const formattedValues = {
        ...values,
        images: typeof values.images === 'string' 
          ? values.images.split(',').map(img => img.trim()) 
          : values.images
      };

      if (selectedProduct?._id) {
        await productApi.update(selectedProduct._id, formattedValues);
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        await productApi.add(formattedValues);
        message.success('Thêm mới sản phẩm thành công!');
      }
      setIsModalOpen(false);
      tableRef?.reload();
    } catch (error) {
      message.error('Thực hiện thất bại, vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình các cột cho Product
  const productColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images) => (
        <Image
          width={60}
          height={60}
          src={images && images.length > 0 ? images[0] : 'https://placehold.co/60x60?text=No+Image'}
          fallback="https://placehold.co/60x60?text=Error"
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>,
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <div style={{ fontWeight: 'bold' }}>
          <div style={{ color: '#f5222d' }}>{new Intl.NumberFormat('vi-VN').format(price)} đ</div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">
          {category?.name || 'Trống'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Đang bán' : 'Ngừng bán'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleOpenModal(record, 'view')} />
          <Button size="small" type="primary" ghost icon={<EditOutlined />} onClick={() => handleOpenModal(record, 'edit')} />
          <Popconfirm title="Xóa sản phẩm?" onConfirm={() => handleDelete(record._id)} okText="Xóa" okButtonProps={{ danger: true }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminTable 
        title="Danh sách Sản phẩm"
        columns={productColumns}
        apiService={productApi}
        rowKey="_id"
        onAdd={handleAdd}
        onRef={handleSetTableRef}
      />

      <AdminModal
        title={modalMode === 'view' ? 'Chi tiết sản phẩm' : (selectedProduct?._id ? 'Chỉnh sửa sản phẩm' : 'Thêm mới sản phẩm')}
        open={isModalOpen}
        mode={modalMode}
        initialValues={selectedProduct}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleSave}
        loading={loading}
      >
        <Form.Item name="title" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="Nhập tên sản phẩm..." />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="price" label="Giá gốc (VND)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
            <InputNumber 
              style={{ width: '100%' }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục!' }]}>
            <Select placeholder="Chọn danh mục">
              {categories.map(cat => (
                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="images" label="Link hình ảnh (Nhiều ảnh cách nhau bởi dấu phẩy)">
          <Input.TextArea placeholder="https://image1.jpg, https://image2.jpg" rows={2} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả sản phẩm">
          <Input.TextArea rows={4} placeholder="Mô tả chi tiết..." />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Option value={true}>Hiển thị (Đang bán)</Option>
            <Option value={false}>Ẩn (Ngừng bán)</Option>
          </Select>
        </Form.Item>
      </AdminModal>
    </>
  );
};

export default ProductManagement;
