import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Space, Button, Tag, message, Form, InputNumber, Typography, Avatar, Badge, Input, Select } from 'antd';
import { SyncOutlined, PlusOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import AdminTable from '../../components/admin/Table';
import AdminModal from '../../components/admin/Modal';
import inventoryApi from '../../api/inventoryApi';

const { Text, Title } = Typography;

/**
 * Inventory Management Page
 * Logic:
 * - Load all inventories from backend (populated with product)
 * - Display stock levels and statuses
 * - Allow adding stock (Restock) via Modal
 */
const InventoryManagement = () => {
  const [data, setData] = useState([]); // Base data from server
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form] = Form.useForm();

  // Load data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await inventoryApi.getAll();
      setData(response);
    } catch (error) {
      message.error('Không thể tải dữ liệu kho!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -- FILTER LOGIC --
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const titleMatch = (item.product?.title || '').toLowerCase().includes(searchText.toLowerCase());
      
      let statusMatch = true;
      if (statusFilter === 'out') statusMatch = item.stock <= 0;
      else if (statusFilter === 'low') statusMatch = item.stock > 0 && item.stock <= 10;
      else if (statusFilter === 'in') statusMatch = item.stock > 10;
      else if (statusFilter === 'sold') statusMatch = item.soldCount > 0;

      return titleMatch && statusMatch;
    });
  }, [data, searchText, statusFilter]);

  const handleOpenRestock = (record) => {
    setSelectedInv(record);
    setIsModalOpen(true);
    form.setFieldsValue({ quantity: 10 });
  };

  const handleRestock = async (values) => {
    setIsActionLoading(true);
    try {
      await inventoryApi.addStock(selectedInv.product._id, values.quantity);
      message.success('Nhập kho thành công!');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại!');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return <Tag color="error">HẾT HÀNG</Tag>;
    if (stock <= 10) return <Tag color="warning">SẮP HẾT</Tag>;
    return <Tag color="success">CÒN HÀNG</Tag>;
  };

  // -- COLUMNS DEFINITION --
  const columns = useMemo(() => [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.product?.images?.[0]} 
            shape="square" 
            size={48} 
            icon={<DatabaseOutlined />}
            style={{ borderRadius: '8px' }}
          />
          <div style={{ maxWidth: '250px' }}>
            <Text strong className="block truncate">{record.product?.title || 'Unknown Product'}</Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>ID: {record.product?._id?.slice(-6).toUpperCase()}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '16px', color: stock <= 10 ? '#ff4d4f' : 'inherit' }}>
            {stock}
          </Text>
          {getStockStatus(stock)}
        </Space>
      ),
    },
    {
      title: 'Đang giữ',
      dataIndex: 'reserved',
      key: 'reserved',
      render: (val) => (
        <Badge count={val} color="blue" offset={[10, 0]}>
          <Text type="secondary">{val}</Text>
        </Badge>
      ),
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldCount',
      key: 'soldCount',
      sorter: (a, b) => a.soldCount - b.soldCount,
      render: (val) => <Text strong color="#52c41a">{val}</Text>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Button 
          type="primary" 
          ghost 
          icon={<PlusOutlined />} 
          onClick={() => handleOpenRestock(record)}
        >
          Nhập hàng
        </Button>
      ),
    },
  ], [handleOpenRestock]);

  // -- FILTERS RENDER --
  const filters = useMemo(() => (
    <Space>
      <Input
        placeholder="Tìm tên sản phẩm..."
        prefix={<SearchOutlined />}
        allowClear
        onChange={e => setSearchText(e.target.value)}
        style={{ width: 200 }}
      />
      <Select
        defaultValue="all"
        style={{ width: 150 }}
        onChange={val => setStatusFilter(val)}
        options={[
          { value: 'all', label: 'Tất cả trạng thái' },
          { value: 'in', label: 'Còn hàng' },
          { value: 'low', label: 'Sắp hết' },
          { value: 'out', label: 'Hết hàng' },
          { value: 'sold', label: 'Sản phẩm đã bán' },
        ]}
      />
    </Space>
  ), []);

  const apiService = useMemo(() => ({
    getAll: fetchData
  }), [fetchData]);

  return (
    <>
      <AdminTable
        title="Quản lý Kho hàng"
        columns={columns}
        dataSource={filteredData} // Use filtered data
        apiService={apiService} // Use memoized apiService
        rowKey="_id"
        extra={filters} // Display filters in header
      />

      <AdminModal
        title="Nhập thêm hàng vào kho"
        open={isModalOpen}
        form={form}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleRestock}
        loading={isActionLoading}
      >
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <Title level={5}>{selectedInv?.product?.title}</Title>
            <Text type="secondary">Tồn kho hiện tại: {selectedInv?.stock}</Text>
        </div>
        
        <Form.Item 
            name="quantity" 
            label="Số lượng nhập thêm" 
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} size="large" />
        </Form.Item>
      </AdminModal>
    </>
  );
};

export default InventoryManagement;
