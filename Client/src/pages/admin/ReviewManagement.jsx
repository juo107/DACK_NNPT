import React, { useState, useEffect } from 'react';
import {
  Table,
  Select,
  Rate,
  Card,
  Avatar,
  Typography,
  Space,
  Empty,
  Spin,
  Badge,
  Tag,
  Button
} from 'antd';
import {
  UserOutlined,
  StarFilled,
  ShoppingOutlined,
  CommentOutlined
} from '@ant-design/icons';
import productApi from '../../api/productApi';
import reviewApi from '../../api/reviewApi';


const { Title, Text } = Typography;
const { Option } = Select;

const ReviewManagement = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detail'
  const [filters, setFilters] = useState({ minRating: null, sortBy: 'count' });
  const [loading, setLoading] = useState(false);

  // 1. Tải dữ liệu tổng hợp (theo yêu cầu lọc sao, số lượng)
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await reviewApi.getSummary(filters);
      setSummaryData(res || []);
    } catch (err) {
      console.error('Không thể tải tổng hợp đánh giá', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  // 2. Chuyển sang xem chi tiết một sản phẩm
  const handleViewDetail = async (record) => {
    try {
      setLoading(true);
      setSelectedProduct(record);
      const res = await reviewApi.getByProductId(record.productId);
      setReviews(res.reviews || []);
      setViewMode('detail');
    } catch (err) {
      console.error('Lỗi tải đánh giá chi tiết', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSummary = () => {
    setSelectedProduct(null);
    setViewMode('summary');
    setReviews([]);
  };

  const summaryColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <Avatar
            shape="square"
            size={48}
            src={record.imageUrl}
            className="rounded-lg shadow-sm"
          />
          <div className="flex flex-col">
            <Text strong className="text-slate-800 line-clamp-1">{text}</Text>
            <Text type="secondary" className="text-[10px] uppercase font-bold tracking-tight">
              {record.price?.toLocaleString()} VNĐ
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đánh giá trung bình',
      dataIndex: 'avgRating',
      key: 'avgRating',
      render: (rating) => (
        <div className="flex items-center gap-2">
          <Rate disabled allowHalf defaultValue={rating} className="text-xs text-amber-500" />
          <Text strong className="text-amber-600">{rating}</Text>
        </div>
      ),
      sorter: (a, b) => a.avgRating - b.avgRating,
    },
    {
      title: 'Số lượng bình luận',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      render: (count) => (
        <Badge
          count={count}
          overflowCount={999}
          showZero
          color={count > 10 ? '#52c41a' : '#bfbfbf'}
          className="font-bold"
        />
      ),
      sorter: (a, b) => a.reviewCount - b.reviewCount,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          size="small"
          className="rounded-lg font-bold"
          onClick={() => handleViewDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const reviewColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <Space>
          <Avatar src={user?.avatarUrl} icon={<UserOutlined />} className="bg-slate-200" />
          <div className="flex flex-col">
            <Text strong className="text-slate-800">{user?.username || 'Khách ẩn danh'}</Text>
            <Text type="secondary" className="text-[10px]">{user?.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} className="text-xs text-amber-500" />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Nội dung',
      dataIndex: 'comment',
      key: 'comment',
      width: '40%',
      render: (comment) => <Text className="italic text-slate-600">"{comment}"</Text>,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text className="text-[11px] text-slate-400">{new Date(date).toLocaleString()}</Text>,
    },
  ];

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Title level={2} className="!m-0 flex items-center gap-3">
            <CommentOutlined className="text-primary" />
            {viewMode === 'summary' ? 'Quản lý Đánh giá' : 'Chi tiết Đánh giá'}
          </Title>
          <Text type="secondary" className="font-medium">
            {viewMode === 'summary'
              ? 'Thống kê phản hồi khách hàng theo sản phẩm'
              : `Bản ghi đánh giá cho sản phẩm: ${selectedProduct?.title}`}
          </Text>
        </div>

        {viewMode === 'summary' ? (
          <Space wrap size="middle" className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col">
              <Text strong className="text-[10px] uppercase text-slate-400 mb-1">Lọc số sao:</Text>
              <Select
                placeholder="Số sao"
                className="w-32"
                allowClear
                onChange={(val) => setFilters(prev => ({ ...prev, minRating: val }))}
              >
                <Option value={4}>4 sao trở lên</Option>
                <Option value={5}>Chỉ 5 sao</Option>
              </Select>
            </div>
            <div className="flex flex-col">
              <Text strong className="text-[10px] uppercase text-slate-400 mb-1">Sắp xếp theo:</Text>
              <Select
                defaultValue="count"
                className="w-44"
                onChange={(val) => setFilters(prev => ({ ...prev, sortBy: val }))}
              >
                <Option value="count">Nhiều bình luận nhất</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
              </Select>
            </div>
          </Space>
        ) : (
          <Button
            icon={<ShoppingOutlined />}
            onClick={handleBackToSummary}
            className="rounded-xl h-10 font-bold border-slate-200"
          >
            Quay lại danh sách
          </Button>
        )}
      </div>

      <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
        {viewMode === 'summary' ? (
          <Table
            dataSource={summaryData}
            columns={summaryColumns}
            rowKey="productId"
            loading={loading}
            pagination={{ pageSize: 8 }}
            className="custom-table"
          />
        ) : (
          <Table
            dataSource={reviews}
            columns={reviewColumns}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 8 }}
            className="custom-table"
          />
        )}
      </Card>
    </div>
  );
};

export default ReviewManagement;
