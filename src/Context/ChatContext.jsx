import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);


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
        if (Array.isArray(data)) {
            setChats(data);
        }
    } catch (e) { console.error(e); }
  };


  const startChat = (targetUser) => {
    if (!targetUser) return;
    setIsOpen(true); 
    
   
    const existingChat = chats.find(c => c._id === targetUser._id);
    
    if (existingChat) {
   
        setActiveChat(existingChat);
    } else {

        const newChat = {
            _id: targetUser._id,
            name: targetUser.name,
            username: targetUser.username,
            avatar: targetUser.avatar,
            messages: [] 
        };
        
   
        setActiveChat(newChat);
        

        setChats(prev => {
            if (prev.find(p => p._id === newChat._id)) return prev;
            return [newChat, ...prev];
        });
    }
  };


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
    } catch (e) { 
        alert("Mesaj göndərilə bilmədi. İnterneti yoxlayın."); 
    }
  };

  useEffect(() => {
      let isMounted = true;
      if (activeChat?._id && isOpen) {
          const fetchMsgs = async () => {
              try {
                  const { data } = await api.get(`/chat/conversation/${activeChat._id}`);
                  if (isMounted) {
                      setActiveChat(prev => {
                          if (prev && prev._id === activeChat._id) {
                          
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
          fetchMsgs(); 
          const interval = setInterval(fetchMsgs, 3000); 
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