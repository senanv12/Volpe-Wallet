import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Inbox yüklə
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
       fetchChatList();
       const interval = setInterval(fetchChatList, 5000);
       return () => clearInterval(interval);
    }
  }, []);

  const fetchChatList = async () => {
    try {
        const { data } = await api.get('/chat/users');
        // YALNIZ ARRAY QƏBUL ET
        if (Array.isArray(data)) {
            setChats(data);
        }
    } catch (e) { console.error(e); }
  };

  const startChat = (targetUser) => {
    if (!targetUser) return;
    setIsOpen(true);
    const existing = chats.find(c => c._id === targetUser._id);
    
    if (existing) {
        setActiveChat(existing);
    } else {
        setActiveChat({
            _id: targetUser._id,
            name: targetUser.name,
            username: targetUser.username,
            avatar: targetUser.avatar,
            messages: []
        });
    }
  };

  // MESAJLARI YÜKLƏ (Təhlükəsiz Versiya)
  useEffect(() => {
      let isMounted = true;
      if (activeChat?._id) {
          const fetchMsgs = async () => {
              try {
                  const { data } = await api.get(`/chat/conversation/${activeChat._id}`);
                  if (isMounted) {
                      setActiveChat(prev => {
                          if (prev && prev._id === activeChat._id) {
                              // Gələn data Array deyilsə, boş array qoy
                              return { ...prev, messages: Array.isArray(data) ? data : [] };
                          }
                          return prev;
                      });
                  }
              } catch (error) { console.error(error); }
          };
          
          fetchMsgs();
          const interval = setInterval(fetchMsgs, 3000);
          return () => { clearInterval(interval); isMounted = false; };
      }
  }, [activeChat?._id]);

  const sendMessage = async (text) => {
    if (!activeChat || !text.trim()) return;
    try {
        const { data } = await api.post('/chat/send', { 
            recipientId: activeChat._id, 
            text 
        });
        setActiveChat(prev => ({
            ...prev,
            messages: [...(prev.messages || []), data]
        }));
        fetchChatList();
    } catch (e) { alert("Mesaj getmədi"); }
  };

  const toggleWidget = () => setIsOpen(!isOpen);

  return (
    <ChatContext.Provider value={{ 
      isOpen, setIsOpen, toggleWidget, chats, activeChat, setActiveChat, startChat, sendMessage, unreadCount 
    }}>
      {children}
    </ChatContext.Provider>
  );
};