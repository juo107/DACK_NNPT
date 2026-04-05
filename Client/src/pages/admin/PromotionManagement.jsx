import React, { useState, useCallback } from 'react';
import { Space, Button, Tag, Popconfirm, message, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AdminTable from '../../components/admin/Table';
import AdminModal from '../../components/admin/Modal';
import promotionApi from '../../api/promotionApi';

const { Option } = Select;
const { RangePicker } = DatePicker;

const PromotionManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableRef, setTableRef] = useState(null);

    const handleSetTableRef = useCallback((ref) => {
        setTableRef(ref);
    }, []);

    const handleAdd = () => {
        setSelectedPromo({
            status: true,
            discountType: 'percentage',
            discountValue: 0,
            minOrderValue: 0,
            usageLimit: 100,
            startDate: dayjs(),
            endDate: dayjs().add(7, 'day'),
        });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleOpenModal = (record, mode) => {
        const formattedRecord = {
            ...record,
            dates: [dayjs(record.startDate), dayjs(record.endDate)]
        };
        setSelectedPromo(formattedRecord);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await promotionApi.delete(id);
            message.success('Đã xóa khuyến mãi thành công!');
            tableRef?.reload();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa!');
        }
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const { dates, ...rest } = values;
            const formattedValues = {
                ...rest,
                startDate: dates[0].toISOString(),
                endDate: dates[1].toISOString(),
            };

            if (selectedPromo?._id) {
                await promotionApi.update(selectedPromo._id, formattedValues);
                message.success('Cập nhật khuyến mãi thành công!');
            } else {
                await promotionApi.add(formattedValues);
                message.success('Thêm mới khuyến mãi thành công!');
            }
            setIsModalOpen(false);
            tableRef?.reload();
        } catch (error) {
            message.error(error.response?.data?.message || 'Thực hiện thất bại, vui lòng kiểm tra lại!');
        } finally {
            setLoading(false);
        }
    };

    const promoColumns = [
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            render: (code) => <Tag color="blue" icon={<CopyOutlined />}>{code}</Tag>,
        },
        {
            title: 'Tên chương trình',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span style={{ fontWeight: '500' }}>{text}</span>,
        },
        {
            title: 'Hình thức',
            dataIndex: 'discountType',
            key: 'discountType',
            render: (type, record) => (
                <span>
                    {type === 'percentage' ? `${record.discountValue}%` : `${new Intl.NumberFormat('vi-VN').format(record.discountValue)} đ`}
                </span>
            ),
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => (
                <div style={{ fontSize: '12px' }}>
                    <div>BĐ: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
                    <div>KT: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
                </div>
            ),
        },
        {
            title: 'Sử dụng',
            key: 'usage',
            render: (_, record) => (
                <span>{record.usedCount} / {record.usageLimit || '∞'}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                const now = dayjs();
                const isExpired = now.isAfter(dayjs(record.endDate));
                const isFuture = now.isBefore(dayjs(record.startDate));
                
                if (!status) return <Tag color="default">Vô hiệu</Tag>;
                if (isExpired) return <Tag color="error">Hết hạn</Tag>;
                if (isFuture) return <Tag color="processing">Sắp diễn ra</Tag>;
                return <Tag color="success">Đang chạy</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 140,
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EyeOutlined />} onClick={() => handleOpenModal(record, 'view')} />
                    <Button size="small" type="primary" ghost icon={<EditOutlined />} onClick={() => handleOpenModal(record, 'edit')} />
                    <Popconfirm title="Xóa khuyến mãi?" onConfirm={() => handleDelete(record._id)} okText="Xóa" okButtonProps={{ danger: true }}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <AdminTable
                title="Danh sách Khuyến mãi"
                columns={promoColumns}
                apiService={promotionApi}
                rowKey="_id"
                onAdd={handleAdd}
                onRef={handleSetTableRef}
            />

            <AdminModal
                title={modalMode === 'view' ? 'Chi tiết khuyến mãi' : (selectedPromo?._id ? 'Chỉnh sửa khuyến mãi' : 'Thêm mới khuyến mãi')}
                open={isModalOpen}
                mode={modalMode}
                initialValues={selectedPromo}
                onCancel={() => setIsModalOpen(false)}
                onSave={handleSave}
                loading={loading}
                width={700}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item name="code" label="Mã khuyến mãi (Code)" rules={[{ required: true, message: 'Nhập mã!' }]}>
                        <Input placeholder="VD: SUMMER30" style={{ textTransform: 'uppercase' }} />
                    </Form.Item>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề!' }]}>
                        <Input placeholder="VD: Giảm giá hè rực rỡ" />
                    </Form.Item>
                </div>

                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea placeholder="Mô tả chi tiết về chương trình..." rows={2} />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <Form.Item name="discountType" label="Loại giảm giá" rules={[{ required: true }]}>
                        <Select>
                            <Option value="percentage">Phần trăm (%)</Option>
                            <Option value="fixed">Số tiền cố định (đ)</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="maxDiscountValue" label="Giảm tối đa (đ)">
                        <InputNumber style={{ width: '100%' }} min={0} placeholder="Cho %" />
                    </Form.Item>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item name="minOrderValue" label="Đơn hàng tối thiểu (đ)">
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="usageLimit" label="Tổng lượt dùng">
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                </div>

                <Form.Item name="dates" label="Thời hạn áp dụng" rules={[{ required: true, message: 'Chọn thời gian!' }]}>
                    <RangePicker style={{ width: '100%' }} showTime format="DD/MM/YYYY HH:mm" />
                </Form.Item>

                <Form.Item name="status" label="Trạng thái">
                    <Select>
                        <Option value={true}>Kích hoạt</Option>
                        <Option value={false}>Vô hiệu hóa</Option>
                    </Select>
                </Form.Item>
            </AdminModal>
        </>
    );
};

export default PromotionManagement;
