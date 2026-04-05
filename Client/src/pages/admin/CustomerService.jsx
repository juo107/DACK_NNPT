import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  List, 
  Avatar, 
  Input, 
  Button, 
  Typography, 
  Badge, 
  Empty, 
  Spin,
  Tooltip
} from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  SearchOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { io } from 'socket.io-client';
import messageApi from '../../api/messageApi';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

// URL của Server Socket (không có /api/v1)
const SOCKET_URL = 'http://localhost:3000';

const CustomerService = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // 1. Phê duyệt định danh Admin và Kết nối Socket
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    setCurrentUser(user);

    if (token) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token }
      });

      // Lắng nghe sự kiện tin nhắn mới
      socketRef.current.on('newMessage', () => {
        // Refresh lại dữ liệu khi có tin nhắn mới
        loadConversations();
        if (selectedUser) {
          loadMessages(selectedUser._id);
        }
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [selectedUser]);

  // 2. Load danh sách hội thoại
  const loadConversations = async () => {
    try {
      const res = await messageApi.getConversations();
      setConversations(res || []);
    } catch (err) {
      console.error('Không thể tải hội thoại', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 3. Load lịch sử tin nhắm với User được chọn
  const loadMessages = async (userId) => {
    try {
      setLoading(true);
      const res = await messageApi.getMessages(userId);
      // Backend đang trả về tin nhắn mới nhất trước, ta đảo ngược để chat trôi xuống
      setMessages((res || []).reverse());
    } catch (err) {
      console.error('Không thể tải tin nhắn', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    loadMessages(user._id);
    // Join vào room của user đó để nhận event
    if (socketRef.current) {
      socketRef.current.emit('joinUser', user._id);
    }
  };

  // 4. Gửi tin nhắn
  const handleSend = async () => {
    if (!inputText.trim() || !selectedUser) return;

    try {
      const payload = {
        to: selectedUser._id,
        text: inputText
      };
      
      await messageApi.send(payload);
      
      // Thông báo qua socket (logic hiện tại của backend là báo newMessage)
      socketRef.current.emit('newMessage', {
        to: selectedUser._id,
        from: currentUser._id
      });

      setInputText('');
      // Tạm thời push thẳng vào UI để mượt mà
      setMessages([...messages, {
        from: currentUser,
        to: selectedUser,
        messageContent: { text: inputText, type: 'text' },
        createdAt: new Date()
      }]);
    } catch (err) {
      console.error('Gửi tin nhắn thất bại', err);
    }
  };

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Lọc danh sách hội thoại
  const filteredConversations = conversations.filter(conv => 
    conv.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout className="h-[calc(100vh-100px)] bg-white rounded-3xl overflow-hidden shadow-2xl">
      <Sider width={320} className="bg-slate-50 border-r border-slate-100 py-6" theme="light">
        <div className="px-6 mb-6">
          <Title level={4} className="!m-0 !mb-4 flex items-center gap-2">
            <CustomerServiceOutlined className="text-primary" />
            Tư vấn Khách 
          </Title>
          <Input
            placeholder="Tìm khách hàng..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="rounded-xl h-10 border-slate-200"
          />
        </div>

        <div className="overflow-y-auto h-[calc(100%-100px)] px-2">
          <List
            itemLayout="horizontal"
            dataSource={filteredConversations}
            renderItem={item => (
              <List.Item 
                onClick={() => handleSelectUser(item.user)}
                className={`cursor-pointer px-4 rounded-2xl mx-1 transition-all hover:bg-slate-100 border-none mb-1 ${selectedUser?._id === item.user?._id ? 'bg-primary/5 !border-l-4 !border-primary' : ''}`}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.user?.avatarUrl} icon={<UserOutlined />} className="bg-slate-300" />}
                  title={<span className="font-bold text-slate-800">{item.user?.username}</span>}
                  description={
                    <Text ellipsis className="text-slate-400 text-xs italic">
                      {item.lastMessage?.messageContent?.text || 'Gửi ảnh'}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>

      <Content className="flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Header chat */}
            <div className="px-8 py-4 border-b border-slate-50 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <Avatar size="large" src={selectedUser?.avatarUrl} icon={<UserOutlined />} />
                <div>
                  <div className="font-black text-slate-900">{selectedUser?.username}</div>
                  <Badge status="processing" text={<span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Đang trực tuyến</span>} />
                </div>
              </div>
            </div>

            {/* Khung tin nhắn */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
              {loading ? (
                <div className="h-full flex items-center justify-center"><Spin /></div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = (msg.from?._id || msg.from) === currentUser?._id;
                  return (
                    <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 rounded-3xl shadow-sm ${
                        isMine 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                      }`}>
                        <Text className={`block mb-1 ${isMine ? 'text-white/80' : 'text-slate-400'} text-[10px] font-bold`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <div className="text-sm font-medium leading-relaxed">
                          {msg.messageContent?.type === 'file' ? (
                            <img src={`http://localhost:3000${msg.messageContent?.text}`} alt="Chat file" className="max-w-full rounded-xl" />
                          ) : msg.messageContent?.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Thanh nhập liệu */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-3">
                <Input
                  placeholder="Nhập nội dung tư vấn..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onPressEnter={handleSend}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white shadow-none"
                />
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<SendOutlined />} 
                  onClick={handleSend}
                  className="!h-12 !w-12 !rounded-2xl !bg-primary shadow-lg shadow-primary/20"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-20 text-center">
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Title level={3} className="!text-slate-900 !mb-2 italic">CUSTOMER SUPPORT</Title>
                  <Text className="text-slate-400">Chọn một khách hàng để bắt đầu phiên tư vấn trực tuyến.</Text>
                </div>
              }
            />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default CustomerService;
