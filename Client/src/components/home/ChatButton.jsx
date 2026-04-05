import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Tooltip, Badge, Avatar, Input, Spin } from 'antd';
import { 
  MessageFilled, 
  CloseOutlined, 
  PhoneFilled, 
  FacebookFilled, 
  CommentOutlined,
  SendOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import messageApi from '../../api/messageApi';
import axios from 'axios';
import './ChatButton.css';

const SOCKET_URL = 'http://localhost:3000';

const ChatButton = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Ẩn nút chat khi ở trang Admin (Siết chặt logic ẩn)
  const isAdminPath = location.pathname.startsWith('/admin') || window.location.pathname.includes('/admin');
  if (isAdminPath) {
    return null;
  }

  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      _id: 'welcome',
      from: 'bot',
      messageContent: { text: 'Chào bạn! Rất vui được hỗ trợ bạn. Bạn đang quan tâm đến sản phẩm nào ạ?', type: 'text' },
      createdAt: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // 1. Khởi tạo & Kết nối Socket
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    setCurrentUser(user);

    if (token) {
      socketRef.current = io(SOCKET_URL, { auth: { token } });

      socketRef.current.on('newMessage', () => {
        if (isChatWindowOpen) {
          loadMessages();
        }
      });
    }

    // Lấy thông tin Admin hỗ trợ (API đã được mở công khai)
    const fetchAdmin = async () => {
      try {
        const response = await axiosInstance.get('/users/support-admin');
        if (response) {
          setAdminUser(response);
          console.log('Đã kết nối với Admin hỗ trợ:', response.username);
        }
      } catch (err) {
        console.error('LỖI KẾT NỐI ADMIN HỖ TRỢ:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
      }
    };
    fetchAdmin();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isChatWindowOpen]);

  // 2. Tải lịch sử chat khi mở cửa sổ
  const loadMessages = async () => {
    if (!currentUser || !adminUser) return;
    try {
      setLoading(true);
      const res = await messageApi.getMessages(adminUser._id);
      if (res && res.length > 0) {
        setMessages([...res].reverse());
      }
    } catch (err) {
      console.error('Lỗi tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isChatWindowOpen && adminUser) {
      loadMessages();
    }
  }, [isChatWindowOpen, adminUser]);

  // 3. Gửi tin nhắn
  const handleSend = async () => {
    if (!inputText.trim() || !currentUser || !adminUser) return;

    try {
      const payload = {
        to: adminUser._id,
        text: inputText
      };
      
      await messageApi.send(payload);
      
      if (socketRef.current) {
        socketRef.current.emit('newMessage', {
          to: adminUser._id,
          from: currentUser._id
        });
      }

      setMessages(prev => [...prev, {
        from: currentUser,
        to: adminUser,
        messageContent: { text: inputText, type: 'text' },
        createdAt: new Date(),
        _id: Date.now().toString()
      }]);
      setInputText('');
    } catch (err) {
      console.error('Gửi thất bại');
    }
  };

  // 4. Cuộn xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      <div className={`chat-window ${isChatWindowOpen ? 'show' : ''} shadow-2xl rounded-3xl overflow-hidden`}>
        <div className="chat-header bg-primary !p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge status="processing" color="green">
              <Avatar size="large" src={adminUser?.avatarUrl} icon={<UserOutlined />} className="bg-white/20" />
            </Badge>
            <div className="flex flex-col">
              <span className="text-white text-sm font-black leading-tight">Hỗ trợ khách hàng</span>
              <span className="text-[10px] text-green-200 uppercase tracking-widest font-bold">Trực tuyến 24/7</span>
            </div>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: 'white' }} />}
            onClick={() => setIsChatWindowOpen(false)}
            size="small"
            className="hover:rotate-90 transition-transform duration-300"
          />
        </div>

        <div className="chat-content flex flex-col p-4 bg-slate-50/50 overflow-y-auto h-[350px]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center"><Spin /></div>
          ) : (
            messages.map((msg, index) => {
              const isMine = (msg.from?._id || msg.from) === currentUser?._id;
              return (
                <div key={msg._id || index} className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                    isMine 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-slate-700 rounded-bl-none border border-slate-100 shadow-sm'
                  }`}>
                    {msg.messageContent?.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer p-4 border-t border-slate-100 bg-white shadow-inner">
          {currentUser ? (
            <div className="flex gap-2">
              <Input
                placeholder="Nhập nội dung cần tư vấn..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onPressEnter={handleSend}
                className="rounded-xl h-10 border-slate-100 bg-slate-50"
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />} 
                onClick={handleSend}
                className="h-10 w-10 !rounded-xl !bg-primary"
              />
            </div>
          ) : (
            <div className="text-center py-2 italic text-slate-400 text-[10px]">
              Vui lòng đăng nhập để bắt đầu phiên tư vấn.
            </div>
          )}
        </div>
      </div>

      {/* List of contact icons */}
      <div className={`contact-list ${isOpen ? 'show' : ''}`}>
        {contactMethods.map((item) => (
          <Tooltip key={item.id} title={item.name} placement="left">
            {item.onClick ? (
              <div
                className="contact-item cursor-pointer shadow-lg hover:scale-110 transition-transform"
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
                className="contact-item shadow-lg hover:scale-110 transition-transform"
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
        className="main-chat-button shadow-xl"
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
        {!isOpen && !isChatWindowOpen && <span className="button-text text-xs font-black uppercase tracking-tighter ml-2">Chat hỗ trợ</span>}
      </div>
    </div>
  );
};

export default ChatButton;

