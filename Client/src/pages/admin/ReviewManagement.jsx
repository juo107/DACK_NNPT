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
  Tag
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
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // 1. Tải danh sách sản phẩm để cho phép chọn lọc
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await productApi.getAll();
        setProducts(res || []);
      } catch (err) {
        console.error('Không thể tải danh sách sản phẩm', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Tải đánh giá của sản phẩm khi được chọn
  const handleSelectProduct = async (productId) => {
    const product = products.find(p => p._id === productId);
    setSelectedProduct(product);
    try {
      setLoading(true);
      const res = await reviewApi.getByProductId(productId);
      setReviews(res.reviews || []);
      setSummary({
        averageRating: res.averageRating,
        totalReviews: res.reviews.length
      });
    } catch (err) {
      console.error('Không thể tải đánh giá', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
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
      render: (comment) => <Text className="italic text-slate-600 line-clamp-2">"{comment}"</Text>,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text className="text-[11px] text-slate-400">{new Date(date).toLocaleString()}</Text>,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <div className="p-2">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Title level={2} className="!m-0 flex items-center gap-3">
            <CommentOutlined className="text-primary" />
            Quản lý Đánh giá
          </Title>
          <Text type="secondary" className="font-medium">
            Theo dõi phản hồi từ khách hàng cho từng sản phẩm
          </Text>
        </div>
        
        <div className="w-full md:w-[400px]">
          <Text strong className="block mb-2 text-slate-500 uppercase tracking-widest text-[10px]">Chọn sản phẩm muốn xem:</Text>
          <Select
            showSearch
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full h-12 shadow-sm rounded-xl overflow-hidden"
            optionFilterProp="children"
            onChange={handleSelectProduct}
            loading={loadingProducts}
          >
            {products.map(p => (
              <Option key={p._id} value={p._id}>
                {p.title}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {selectedProduct ? (
        <Space direction="vertical" size="large" className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-3xl border-none shadow-xl bg-gradient-to-br from-white to-slate-50/50">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                <img 
                  src={selectedProduct.images?.[0]} 
                  alt={selectedProduct.title} 
                  className="w-32 h-32 object-cover rounded-3xl shadow-lg transition-transform group-hover:scale-105 duration-300" 
                />
                <Badge 
                  count={summary?.totalReviews} 
                  className="absolute -top-3 -right-3"
                  style={{ backgroundColor: '#1677ff', fontWeight: 'black', padding: '0 8px' }}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <Tag color="cyan" className="rounded-full mb-2 font-bold uppercase tracking-wider">{selectedProduct.category?.name}</Tag>
                <Title level={3} className="!m-0 !mb-2">{selectedProduct.title}</Title>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="flex flex-col items-center border-r border-slate-200 pr-4">
                    <Text className="text-4xl font-black text-amber-500 leading-none">{summary?.averageRating}</Text>
                    <Rate disabled allowHalf value={summary?.averageRating} className="text-[10px]" />
                  </div>
                  <div className="flex flex-col">
                    <Text strong className="text-slate-400 text-[10px] uppercase tracking-widest">Đánh giá chung</Text>
                    <Text type="secondary" className="text-xs italic underline">từ {summary?.totalReviews} người dùng</Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
            <Table
              dataSource={reviews}
              columns={columns}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              className="custom-table"
              locale={{
                emptyText: <Empty description="Sản phẩm này chưa có bài đánh giá nào." />
              }}
            />
          </Card>
        </Space>
      ) : (
        <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="flex flex-col items-center">
                <Text type="secondary" className="text-lg font-medium">Hãy chọn một sản phẩm phía trên để xem các lượt đánh giá chi tiết.</Text>
                <ShoppingOutlined className="text-5xl text-slate-200 mt-6" />
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
