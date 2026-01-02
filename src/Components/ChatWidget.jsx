import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../Context/ChatContext';
import { MessageCircle, X, Send, ArrowLeft, MoreVertical, Image as ImageIcon } from 'lucide-react';
import './css/ChatWidget.css'; 

const ChatWidget = () => {
  const { 
    isOpen, toggleWidget, activeChat, setActiveChat, chats, sendMessage 
  } = useChat();

  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  // Avtomatik aşağı sürüşdürmə
  useEffect(() => {
    if (isOpen && activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages, isOpen, activeChat]);

  if (!user) return null;

  // --- 1. KAPALI HAL (Launcher) ---
  if (!isOpen) return (
    <button className="talkjs-launcher" onClick={toggleWidget}>
        <MessageCircle size={28} />
    </button>
  );

  // --- 2. AÇIQ HAL (Main Container) ---
  return (
    <div className="talkjs-container animate-pop-up">
      
      {/* HEADER */}
      <div className="talkjs-header">
        {activeChat ? (
            <div className="talkjs-header-content">
                <button onClick={() => setActiveChat(null)} className="talkjs-back-btn">
                    <ArrowLeft size={20} />
                </button>
                <div className="talkjs-avatar-header">
                    {activeChat.avatar ? 
                      <img src={activeChat.avatar} alt="av" /> : 
                      (activeChat.name?.[0] || 'U')
                    }
                    <div className="online-dot"></div>
                </div>
                <div className="talkjs-user-info">
                    <span className="talkjs-username">{activeChat.name}</span>
                    <span className="talkjs-status">Online</span>
                </div>
                <button className="talkjs-options-btn"><MoreVertical size={18} /></button>
            </div>
        ) : (
            <div className="talkjs-header-main">
                <span className="talkjs-title">Mesajlar</span>
                <button className="talkjs-close-btn" onClick={toggleWidget}>
                    <X size={20} />
                </button>
            </div>
        )}
      </div>

      {/* BODY */}
      <div className="talkjs-body">
        {!activeChat ? (
            // --- INBOX VIEW (SİYAHI) ---
            <div className="talkjs-inbox">
                {chats.length === 0 ? (
                    <div className="talkjs-empty">
                        <div className="talkjs-empty-icon"><MessageCircle size={32}/></div>
                        <p>Söhbət tarixçəsi boşdur.</p>
                        <small>Axtarışdan istifadə edərək yeni dostlar tapın.</small>
                    </div>
                ) : (
                    chats.map(chat => (
                        <div key={chat._id} className="talkjs-conversation-item" onClick={() => setActiveChat(chat)}>
                            <div className="talkjs-avatar-wrapper">
                                {chat.avatar ? 
                                  <img src={chat.avatar} alt="avatar" /> : 
                                  (chat.name?.[0] || 'U')
                                }
                            </div>
                            <div className="talkjs-conversation-info">
                                <div className="talkjs-info-top">
                                    <span className="talkjs-name">{chat.name}</span>
                                    {/* Son mesaj vaxtı (Demo üçün statik qoyuruq, backend-dən gəlsə dəyişərsən) */}
                                    <span className="talkjs-time">12:30</span>
                                </div>
                                <div className="talkjs-info-bottom">
                                    <span className="talkjs-preview">
                                        {chat.lastMessage 
                                            ? (chat.lastMessage.length > 25 ? chat.lastMessage.substring(0, 25) + '...' : chat.lastMessage) 
                                            : 'Söhbətə başla...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        ) : (
            // --- CHAT VIEW (MESAJLAŞMA) ---
            <div className="talkjs-feed">
                {(activeChat.messages || []).map((msg, index) => {
                    const senderData = msg.sender || {};
                    const senderId = typeof senderData === 'object' ? senderData._id : senderData;
                    const isMe = String(senderId) === String(user._id);
                    
                    // Qarşı tərəfin avatarını yalnız sol tərəfdə göstərmək üçün
                    const showAvatar = !isMe;

                    return (
                        <div key={index} className={`talkjs-message-row ${isMe ? 'me' : 'them'}`}>
                            {showAvatar && (
                                <div className="talkjs-message-avatar">
                                    {activeChat.avatar ? 
                                      <img src={activeChat.avatar} alt="av" /> : 
                                      (activeChat.name?.[0] || 'U')
                                    }
                                </div>
                            )}
                            <div className="talkjs-bubble">
                                <div className="talkjs-text">{msg.text}</div>
                                <div className="talkjs-meta">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        )}
      </div>

      {/* FOOTER (INPUT) */}
      {activeChat && (
          <div className="talkjs-footer">
            <button className="talkjs-attach-btn">
                <ImageIcon size={20} />
            </button>
            <div className="talkjs-input-wrapper">
                <input 
                    type="text" 
                    placeholder="Bir mesaj yazın..." 
                    value={text}
                    autoFocus
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (sendMessage(text), setText(''))}
                />
            </div>
            <button 
                className={`talkjs-send-btn ${text.trim() ? 'active' : ''}`}
                onClick={() => { sendMessage(text); setText(''); }}
                disabled={!text.trim()}
            >
                <Send size={18} />
            </button>
          </div>
      )}
    </div>
  );
};

export default ChatWidget;