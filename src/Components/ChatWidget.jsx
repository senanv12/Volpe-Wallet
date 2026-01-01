import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../Context/ChatContext';
import { X, Send, MessageCircle } from 'lucide-react';
import './ChatWidget.css'; // Buna ehtiyac olacaq

const ChatWidget = () => {
  const { isOpen, toggleWidget, activeChat, setActiveChat, chats, sendMessage } = useChat();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  // Mesaj gələndə avtomatik aşağı sürüşdür
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  if (!isOpen) return (
    <button className="chat-launcher" onClick={toggleWidget}>
        <MessageCircle size={28} />
    </button>
  );

  return (
    <div className="chat-widget">
      {/* 1. HEADER */}
      <div className="chat-header">
        <div className="header-info">
            {activeChat ? (
                <>
                    <button onClick={() => setActiveChat(null)} style={{marginRight:'10px', background:'none', border:'none', color:'white', cursor:'pointer'}}>←</button>
                    <span>{activeChat.name}</span>
                </>
            ) : (
                <span>Mesajlar</span>
            )}
        </div>
        <button onClick={toggleWidget} className="close-btn"><X size={20}/></button>
      </div>

      {/* 2. BODY */}
      <div className="chat-body">
        {!activeChat ? (
            // SİYAHI GÖRÜNÜŞÜ (Inbox)
            <div className="chat-list">
                {chats.length === 0 ? <p style={{padding:'20px', color:'#888', textAlign:'center'}}>Heç kimlə yazışmamısınız.</p> : 
                 chats.map(chat => (
                    <div key={chat._id} className="chat-list-item" onClick={() => setActiveChat(chat)}>
                        <div className="chat-avatar">{chat.name.charAt(0)}</div>
                        <div className="chat-details">
                            <span className="chat-name">{chat.name}</span>
                            <span className="chat-preview">{chat.lastMessage?.substring(0, 20)}...</span>
                        </div>
                    </div>
                 ))
                }
            </div>
        ) : (
            // MESAJLAŞMA GÖRÜNÜŞÜ
            <div className="messages-area">
                {/* ƏSAS DÜZƏLİŞ BURADADIR: (activeChat.messages || []) */}
                {(activeChat.messages || []).map((msg, index) => {
                    const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
                    return (
                        <div key={index} className={`message-bubble ${isMe ? 'me' : 'them'}`}>
                            {msg.text}
                            <span className="msg-time">
                                {new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        )}
      </div>

      {/* 3. FOOTER (Sadəcə çat açıq olanda görünür) */}
      {activeChat && (
          <div className="chat-footer">
            <input 
                type="text" 
                placeholder="Mesaj yaz..." 
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (sendMessage(text), setText(''))}
            />
            <button onClick={() => { sendMessage(text); setText(''); }}>
                <Send size={18}/>
            </button>
          </div>
      )}
    </div>
  );
};

export default ChatWidget;