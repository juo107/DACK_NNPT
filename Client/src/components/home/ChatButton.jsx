import React, { useState } from 'react';
import { Button, Tooltip, Badge, Avatar } from 'antd';
import { MessageFilled, CloseOutlined, PhoneFilled, FacebookFilled, CommentOutlined } from '@ant-design/icons';
import './ChatButton.css';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);

  const contactMethods = [
    {
      id: 'chat',
      name: 'Nhắn tin trực tiếp',
      icon: <CommentOutlined />,
      color: '#52c41a',
      onClick: () => {
        setIsChatWindowOpen(true);
        setIsOpen(false);
      },
    },
    {
      id: 'zalo',
      name: 'Chat Zalo',
      icon: <CommentOutlined />,
      color: '#0068ff',
      link: 'https://zalo.me/0123456789',
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      icon: <FacebookFilled />,
      color: '#0084ff',
      link: 'https://m.me/yourpage',
    },
    {
      id: 'phone',
      name: 'Gọi hotline',
      icon: <PhoneFilled />,
      color: '#ff4d4f',
      link: 'tel:0123456789',
    },
  ];

  return (
    <div className="fixed-chat-container">
      {/* Chat Window */}
      <div className={`chat-window ${isChatWindowOpen ? 'show' : ''}`}>
        <div className="chat-header">
          <div className="flex items-center gap-2">
            <Badge status="processing" color="green">
              <Avatar size="small" icon={<MessageFilled />} className="bg-green-500" />
            </Badge>
            <div className="flex flex-col">
              <span className="text-white text-xs font-bold leading-tight">Hỗ trợ khách hàng</span>
              <span className="text-[10px] text-green-200">Đang trực tuyến</span>
            </div>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: 'white' }} />}
            onClick={() => setIsChatWindowOpen(false)}
            size="small"
          />
        </div>
        <div className="chat-content">
          <div className="message bot">
            Chào bạn! Rất vui được hỗ trợ bạn. Bạn đang quan tâm đến sản phẩm nào ạ?
          </div>
        </div>
        <div className="chat-footer">
          <input type="text" placeholder="Nhập tin nhắn..." className="chat-input" />
          <Button type="primary" size="small" icon={<MessageFilled />} />
        </div>
      </div>

      {/* List of contact icons */}
      <div className={`contact-list ${isOpen ? 'show' : ''}`}>
        {contactMethods.map((item) => (
          <Tooltip key={item.id} title={item.name} placement="left">
            {item.onClick ? (
              <div
                className="contact-item cursor-pointer"
                style={{ backgroundColor: item.color }}
                onClick={item.onClick}
              >
                {item.icon}
              </div>
            ) : (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </a>
            )}
          </Tooltip>
        ))}
      </div>

      {/* Main toggle button */}
      <div
        className="main-chat-button"
        onClick={() => {
          if (isChatWindowOpen) {
            setIsChatWindowOpen(false);
          } else {
            setIsOpen(!isOpen);
          }
        }}
      >
        <Badge dot={!isOpen && !isChatWindowOpen} offset={[-5, 5]} color="blue">
          <div className={`icon-wrapper ${isOpen || isChatWindowOpen ? 'rotate' : ''}`}>
            {isOpen || isChatWindowOpen ? <CloseOutlined /> : <MessageFilled />}
          </div>
        </Badge>
        {!isOpen && !isChatWindowOpen && <span className="button-text text-xs font-bold">Hỗ trợ</span>}
      </div>
    </div>
  );
};

export default ChatButton;
