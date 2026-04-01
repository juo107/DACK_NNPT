import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm, Typography } from 'antd';
import { SyncOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

/**
 * Generic Table Component
 * @param {string} title - Tiêu đề bảng
 * @param {array} columns - Cấu hình các cột (Ant Design columns)
 * @param {object} apiService - Đối tượng chứa các hàm getAll và delete
 * @param {string} rowKey - Khóa chính của mỗi dòng (mặc định: _id)
 */
const AdminTable = ({ title, columns, apiService, rowKey = '_id' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm lấy dữ liệu chung
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAll();
      setData(response);
    } catch (error) {
      message.error(`Không thể tải dữ liệu cho ${title}!`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiService) {
      fetchData();
    }
  }, [apiService]);

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
          <Button 
            icon={<SyncOutlined spin={loading} />} 
            onClick={fetchData}
          >
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
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
