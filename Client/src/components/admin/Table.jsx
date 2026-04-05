import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Space, message, Popconfirm, Typography } from 'antd';
import { SyncOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

/**
 * Generic Table Component
 */
const AdminTable = ({ title, columns, apiService, rowKey = '_id', onAdd, onRef, extra, dataSource }) => {
  const [data, setData] = useState(dataSource || []);
  const [loading, setLoading] = useState(false);

  // Cập nhật data nếu dataSource từ ngoài thay đổi
  useEffect(() => {
    if (dataSource) {
      setData(dataSource);
    }
  }, [dataSource]);

  // Hàm lấy dữ liệu chung - Dùng useCallback để tránh render loop
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getAll();
      setData(response);
    } catch (error) {
      message.error(`Không thể tải dữ liệu cho ${title}!`);
    } finally {
      setLoading(false);
    }
  }, [apiService, title]);

  // Để trang cha có thể gọi reload() - Chỉ gọi một lần khi mount hoặc khi fetchData đổi
  useEffect(() => {
    if (onRef) {
      onRef({ reload: fetchData });
    }
  }, [onRef, fetchData]);

  useEffect(() => {
    if (apiService) {
      fetchData();
    }
  }, [apiService, fetchData]);

  // Hàm xóa dữ liệu chung
  const handleDelete = async (id) => {
    try {
      await apiService.delete(id);
      message.success(`Đã xóa thành công!`);
      fetchData();
    } catch (error) {
      message.error('Có lỗi khi xóa dữ liệu!');
    }
  };

  // Thêm cột 'Hành động' mặc định nếu cần (hoặc bạn có thể tự định nghĩa trong columns)
  // Ở đây tôi giả định bạn sẽ tự truyền Action column vào để linh hoạt nhất.

  return (
    <div style={{ 
      padding: '24px', 
      background: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <Title level={3} style={{ margin: 0 }}>{title}</Title>
        <Space>
          {extra}
          <Button 
            icon={<SyncOutlined spin={loading} />} 
            onClick={fetchData}
          >
            Làm mới
          </Button>
          {onAdd && (
            <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={onAdd}
            >
                Thêm mới
            </Button>
          )}
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={data}
        rowKey={rowKey}
        loading={loading}
        pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
        }}
        bordered
      />
    </div>
  );
};

export default AdminTable;
