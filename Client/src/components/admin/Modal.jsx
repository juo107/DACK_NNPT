import React, { useEffect } from 'react';
import { Modal, Form, Button, Space } from 'antd';
import { SaveOutlined, CloseOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons';

/**
 * AdminModal - Thành phần Modal dùng chung cho Admin (Hỗ trợ View và Update)
 */
const AdminModal = ({
  open,
  mode = 'view', // 'view' hoặc 'edit'
  title,
  initialValues,
  onCancel,
  onSave,
  loading = false,
  children,
  width = 700
}) => {
  const [form] = Form.useForm();

  // Đổ dữ liệu vào form khi modal mở
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues, form]);

  const isView = mode === 'view';

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (onSave) {
        await onSave(values);
      }
    } catch (error) {
      console.log('Validate failed:', error);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {isView ? <InfoCircleOutlined style={{ color: '#1890ff' }} /> : <EditOutlined style={{ color: '#faad14' }} />}
          <span style={{ fontWeight: 600 }}>{title}</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      width={width}
      destroyOnClose
      maskClosable={isView}
      footer={[
        <Button key="back" icon={<CloseOutlined />} onClick={onCancel}>
          {isView ? 'Đóng' : 'Hủy'}
        </Button>,
        !isView && (
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleSubmit}
          >
            Cập nhật
          </Button>
        ),
      ]}
    >
      <style>
        {`
          .admin-readonly-form .ant-input-disabled,
          .admin-readonly-form .ant-input-number-disabled,
          .admin-readonly-form .ant-select-disabled .ant-select-selection-item,
          .admin-readonly-form .ant-input-disabled:hover {
            color: rgba(0, 0, 0, 0.85) !important;
            background-color: #f5f5f5 !important;
            cursor: default !important;
          }
          .admin-readonly-form .ant-form-item-label > label {
            font-weight: 500;
          }
        `}
      </style>
      <Form
        form={form}
        layout="vertical"
        disabled={isView} 
        initialValues={initialValues}
        className={isView ? 'admin-readonly-form' : ''}
        style={{ marginTop: 24 }}
        scrollToFirstError
      >
        {children}
      </Form>
    </Modal>
  );
};

export default AdminModal;
