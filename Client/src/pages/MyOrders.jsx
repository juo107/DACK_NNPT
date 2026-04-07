import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Button, Empty, message, Skeleton } from 'antd';
import { ShoppingBag, ArrowLeft, Clock, Scissors } from 'lucide-react';
import reservationApi from '../api/reservationApi';
import { formatCurrency } from '../utils/productHelpers';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await reservationApi.getMyReservations();
            setOrders(response.data || response);
        } catch (error) {
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'items',
            key: 'product',
            render: (items) => (
                <div className="flex flex-col gap-1">
                    {items.map((item, idx) => (
                        <div key={idx} className="font-semibold text-slate-800">
                            {item.title} x {item.quantity}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (
                <span className="font-bold text-primary text-lg">
                    {formatCurrency(amount)}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                let text = 'Đã đặt hàng';
                if (status === 'paid') { color = 'green'; text = 'Đã thanh toán'; }
                if (status === 'cancelled') { color = 'red'; text = 'Đã hủy'; }
                if (status === 'expired') { color = 'orange'; text = 'Hết hạn'; }
                return <Tag color={color} className="rounded-md px-2 py-0.5 uppercase text-[10px] font-bold">{text}</Tag>;
            },
        },
        {
            title: 'Voucher',
            dataIndex: 'promotionCode',
            key: 'promotionCode',
            render: (code) => (
                code ? (
                    <Tag color="success" className="rounded-md px-2 py-0.5 font-semibold">
                        <Scissors className="w-3 h-3 inline mr-1" />
                        {code}
                    </Tag>
                ) : (
                    <span className="text-slate-400 text-xs">Không sử dụng</span>
                )
            ),
        },
        {
            title: 'Thời hạn giữ hàng',
            dataIndex: 'expiredIn',
            key: 'expiredIn',
            render: (date) => (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {new Date(date).toLocaleString('vi-VN')}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại cửa hàng
                        </Link>
                        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">Đơn hàng của tôi</h1>
                        <p className="mt-2 text-slate-600">Theo dõi trạng thái đơn hàng và lịch sử mua sắm của bạn.</p>
                    </div>
                    <div className="hidden lg:block">
                        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng đơn hàng</div>
                                <div className="text-xl font-black text-slate-900">{orders.length} đơn</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-3xl bg-white p-20 shadow-sm border border-slate-100 text-center">
                        <Empty 
                            description={
                                <div className="mt-4">
                                    <p className="text-slate-500 text-lg">Bạn chưa có đơn hàng nào.</p>
                                    <Link to="/products">
                                        <Button type="primary" size="large" className="mt-6 !h-12 !px-8 !rounded-xl !bg-slate-900 hover:!bg-primary transition-all">
                                            Khám phá sản phẩm ngay
                                        </Button>
                                    </Link>
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
                        <Table 
                            columns={columns} 
                            dataSource={orders} 
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                            className="orders-table"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
