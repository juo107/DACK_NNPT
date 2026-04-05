import React from 'react';
import { Tag, Button, message } from 'antd';
import { CopyOutlined, GiftOutlined } from '@ant-design/icons';

const promotions = [
  {
    id: 1,
    title: 'Giảm 10%',
    description: 'Áp dụng cho đơn hàng đầu tiên qua App',
    code: 'WELCOME10',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Freeship',
    description: 'Miễn phí vận chuyển cho đơn từ 500k',
    code: 'FREESHIP',
    color: 'green'
  },
  {
    id: 3,
    title: 'Sale 20%',
    description: 'Duy nhất trong khung giờ 12h - 14h',
    code: 'FLASH20',
    color: 'orange'
  }
];

const Promotions = () => {
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    message.success(`Đã sao chép mã: ${code}`);
  };

  return (
    <section className="py-8 bg-white mt-6 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <GiftOutlined className="text-xl text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900 m-0">Ưu đãi hôm nay</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promotions.map((promo) => (
            <div 
              key={promo.id} 
              className="flex items-center justify-between p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Tag color={promo.color} className="font-bold">{promo.code}</Tag>
                  <span className="text-sm font-bold text-gray-900">{promo.title}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{promo.description}</p>
              </div>
              
              <Button 
                type="text" 
                icon={<CopyOutlined />} 
                onClick={() => copyToClipboard(promo.code)}
                className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Lưu mã
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;
