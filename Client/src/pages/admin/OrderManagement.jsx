import React, { useState, useCallback, useMemo } from 'react';
import { Space, Button, Tag, Popconfirm, message, Form, Select, Descriptions, Table, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined, SyncOutlined, ScissorOutlined as ScissorsOutlined } from '@ant-design/icons';
import AdminTable from '../../components/admin/Table';
import AdminModal from '../../components/admin/Modal';
import reservationApi from '../../api/reservationApi';
import dayjs from 'dayjs';

const { Text } = Typography;

const OrderManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableRef, setTableRef] = useState(null);

  const handleSetTableRef = useCallback((ref) => {
    setTableRef(ref);
  }, []);

  const handleViewDetail = (record) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (values) => {
    setLoading(true);
    try {
      await reservationApi.updateStatusAdmin(selectedOrder._id, values.status);
      message.success('Cập nhật trạng thái đơn hàng thành công!');
      setIsModalOpen(false);
      tableRef?.reload();
    } catch (error) {
      message.error('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reservationApi.deleteAdmin(id);
      message.success('Đã xóa đơn hàng!');
      tableRef?.reload();
    } catch (error) {
      message.error('Không thể xóa đơn hàng!');
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      actived: { color: 'processing', text: 'Chờ xử lý' },
      paid: { color: 'success', text: 'Đã thanh toán' },
      cancelled: { color: 'error', text: 'Đã hủy' },
      expired: { color: 'warning', text: 'Hết hạn' },
    };
    const config = statusMap[status] || { color: 'default', text: status || 'N/A' };
    return <Tag color={config.color}>{(config.text || 'N/A').toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <Text copyable>{id.slice(-8).toUpperCase()}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div>
          <div style={{ fontWeight: '500' }}>{user?.username || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Khuyến mãi',
      key: 'promotion',
      render: (_, record) => (
        record.promotion ? (
          <Space direction="vertical" size={0}>
            <Tag color="magenta">{record.promotion.code}</Tag>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              -{new Intl.NumberFormat('vi-VN').format(record.discountAmount || 0)}đ
            </Text>
          </Space>
        ) : <Text type="secondary">-</Text>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          {new Intl.NumberFormat('vi-VN').format(amount)} đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)} 
          />
          <Popconfirm 
            title="Xóa đơn hàng này?" 
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const apiService = useMemo(() => ({
    getAll: () => reservationApi.getAllAdmin(),
    delete: (id) => reservationApi.deleteAdmin(id)
  }), []);

  const itemColumns = useMemo(() => [
    { title: 'ID Sản phẩm', dataIndex: 'product', key: 'productId', render: (product) => {
      const productId = typeof product === 'object' ? product?._id : product;
      return <Text copyable code>{productId}</Text>;
    }},
    { title: 'Sản phẩm', dataIndex: 'title', key: 'title' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', align: 'center' },
    { 
        title: 'Đơn giá', 
        dataIndex: 'price', 
        key: 'price', 
        render: (p) => `${new Intl.NumberFormat('vi-VN').format(p)}đ` 
    },
    { 
        title: 'Thành tiền', 
        dataIndex: 'subtotal', 
        key: 'subtotal', 
        render: (s) => <b>{new Intl.NumberFormat('vi-VN').format(s)}đ</b> 
    },
  ], []);

  return (
    <>
      <AdminTable
        title="Quản lý Đơn hàng"
        columns={columns}
        apiService={apiService}
        rowKey="_id"
        onRef={handleSetTableRef}
      />

      <AdminModal
        title="Chi tiết đơn hàng"
        open={isModalOpen}
        mode="edit" // Để hiện nút Save/Update trạng thái
        initialValues={selectedOrder}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleUpdateStatus}
        loading={loading}
      >
        <Descriptions title="Thông tin giao hàng" bordered column={2} size="small" style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="ID Đơn hàng"><Text copyable code>{selectedOrder?._id}</Text></Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{getStatusTag(selectedOrder?.status)}</Descriptions.Item>
          <Descriptions.Item label="Người nhận">{selectedOrder?.shippingInfo?.fullName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Điện thoại">{selectedOrder?.shippingInfo?.phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>{selectedOrder?.shippingInfo?.address || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>{selectedOrder?.shippingInfo?.note || 'Không có'}</Descriptions.Item>
          {selectedOrder?.promotion && (
            <>
              <Descriptions.Item label="Mã giảm giá">
                <Tag color="magenta" icon={<ScissorsOutlined />}>{selectedOrder.promotion.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền giảm">
                <Text type="danger" strong>-{new Intl.NumberFormat('vi-VN').format(selectedOrder.discountAmount)}đ</Text>
              </Descriptions.Item>
            </>
          )}
        </Descriptions>

        <Typography.Title level={5}>Sản phẩm trong đơn</Typography.Title>
        <Table 
            dataSource={selectedOrder?.items || []} 
            columns={itemColumns} 
            pagination={false} 
            size="small" 
            rowKey={(item) => item.product?._id || Math.random()}
            style={{ marginBottom: '24px' }}
        />

        <Form.Item name="status" label="Cập nhật Trạng thái">
          <Select>
            <Select.Option value="actived">Chờ xử lý</Select.Option>
            <Select.Option value="paid">Đã thanh toán</Select.Option>
            <Select.Option value="cancelled">Hủy đơn hàng</Select.Option>
          </Select>
        </Form.Item>
      </AdminModal>
    </>
  );
};

export default OrderManagement;
