import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // İstifadəçi daxil olubsa, siyahını yüklə
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
       fetchChatList();
       // Hər 5 saniyədən bir yeni mesajları yoxla
       const interval = setInterval(fetchChatList, 5000);
       return () => clearInterval(interval);
    }
  }, []);

  const fetchChatList = async () => {
    try {
        const { data } = await api.get('/chat/users');
        if (Array.isArray(data)) {
            setChats(data);
        }
    } catch (e) { console.error(e); }
  };

  // --- ƏSAS DÜZƏLİŞ BURADADIR ---
  const startChat = (targetUser) => {
    if (!targetUser) return;
    setIsOpen(true); // Çat pəncərəsini aç
    
    // 1. Siyahıda bu adam varmı?
    const existingChat = chats.find(c => c._id === targetUser._id);
    
    if (existingChat) {
        // Varsa, onu aktiv et
        setActiveChat(existingChat);
    } else {
        // Yoxdursa, müvəqqəti obyekt yarat
        const newChat = {
            _id: targetUser._id,
            name: targetUser.name,
            username: targetUser.username,
            avatar: targetUser.avatar,
            messages: [] // Boş mesaj siyahısı
        };
        
        // Aktiv et
        setActiveChat(newChat);
        
        // Siyahıya əlavə et (əgər artıq yoxdursa)
        setChats(prev => {
            if (prev.find(p => p._id === newChat._id)) return prev;
            return [newChat, ...prev];
        });
    }
  };

  // Mesaj göndərmək
  const sendMessage = async (text) => {
    if (!activeChat || !text.trim()) return;
    try {
        const { data } = await api.post('/chat/send', { 
            recipientId: activeChat._id, 
            text 
        });
        
        // Mesaj gedən kimi ekranda göstər
        setActiveChat(prev => ({
            ...prev,
            messages: [...(prev.messages || []), data]
        }));
        
        // Siyahını arxa planda yenilə
        fetchChatList();
    } catch (e) { 
        alert("Mesaj göndərilə bilmədi. İnterneti yoxlayın."); 
    }
  };

  // Aktiv çatı yeniləmək (Real-vaxt mesajları görmək üçün)
  useEffect(() => {
      let isMounted = true;
      if (activeChat?._id && isOpen) {
          const fetchMsgs = async () => {
              try {
                  const { data } = await api.get(`/chat/conversation/${activeChat._id}`);
                  if (isMounted) {
                      setActiveChat(prev => {
                          if (prev && prev._id === activeChat._id) {
                              // Yalnız mesaj sayı dəyişibsə yenilə (performans üçün)
                              const prevLen = prev.messages ? prev.messages.length : 0;
                              if (Array.isArray(data) && data.length !== prevLen) {
                                  return { ...prev, messages: data };
                              }
                          }
                          return prev;
                      });
                  }
              } catch (error) { console.error(error); }
          };
          fetchMsgs(); // İlk açılan kimi yüklə
          const interval = setInterval(fetchMsgs, 3000); // Hər 3 saniyədən bir yoxla
          return () => { clearInterval(interval); isMounted = false; };
      }
  }, [activeChat?._id, isOpen]);

  const toggleWidget = () => setIsOpen(!isOpen);

  return (
    <ChatContext.Provider value={{ 
      isOpen, setIsOpen, toggleWidget, chats, activeChat, setActiveChat, startChat, sendMessage 
    }}>
      {children}
    </ChatContext.Provider>
  );
};