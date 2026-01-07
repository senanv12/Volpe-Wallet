import React, { useState, useEffect } from 'react';
import { X, Send, UserPlus, Search, MessageSquare } from 'lucide-react';
import './css/ChatModal.css';

const ChatModal = ({ isOpen, onClose }) => {
  const [contacts, setContacts] = useState([
    { id: 1, username: 'volpe_support', name: 'Dəstək', lastMsg: 'Sizə necə kömək edə bilərəm?' }
  ]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newUserQuery, setNewUserQuery] = useState('');
  const [messages, setMessages] = useState({});
  const [inputMsg, setInputMsg] = useState('');

  // LocalStorage-dan mesajları yüklə (isteğe bağlı)
  useEffect(() => {
    const savedMsgs = localStorage.getItem('local_chats');
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  }, []);

  const handleAddContact = () => {
    if (!newUserQuery.trim()) return;
    const username = newUserQuery.replace('@', '').toLowerCase();
    const exists = contacts.find(c => c.username === username);

    if (!exists) {
      const newContact = {
        id: Date.now(),
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        lastMsg: 'Yeni söhbət'
      };
      setContacts([newContact, ...contacts]);
      setSelectedContact(newContact);
    } else {
      setSelectedContact(exists);
    }
    setNewUserQuery('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedContact) return;

    const currentChat = messages[selectedContact.username] || [];
    const newMsg = {
      id: Date.now(),
      text: inputMsg,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = {
      ...messages,
      [selectedContact.username]: [...currentChat, newMsg]
    };

    setMessages(updatedMsgs);
    localStorage.setItem('local_chats', JSON.stringify(updatedMsgs));
    setInputMsg('');
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Sol Panel: Siyahı */}
        <div className="chat-modal-sidebar">
          <div className="chat-sidebar-header">
            <h4>Mesajlar</h4>
            <div className="chat-search-input">
              <input 
                type="text" 
                placeholder="@user əlavə et..." 
                value={newUserQuery}
                onChange={e => setNewUserQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAddContact()}
              />
              <button onClick={handleAddContact}><UserPlus size={16}/></button>
            </div>
          </div>
          <div className="chat-contacts-list">
            {contacts.map(c => (
              <div 
                key={c.id} 
                className={`chat-contact-item ${selectedContact?.username === c.username ? 'active' : ''}`}
                onClick={() => setSelectedContact(c)}
              >
                <div className="chat-avatar-circle">{c.name[0]}</div>
                <div className="chat-contact-meta">
                  <span className="chat-contact-name">{c.name}</span>
                  <span className="chat-contact-preview">{c.lastMsg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Panel: Mesajlar */}
        <div className="chat-modal-main">
          <div className="chat-main-header">
            {selectedContact ? (
              <div className="chat-current-user">
                <div className="chat-avatar-small">{selectedContact.name[0]}</div>
                <span>{selectedContact.name}</span>
              </div>
            ) : <span>Söhbət seçin</span>}
            <button className="chat-close-btn" onClick={onClose}><X size={20}/></button>
          </div>

          <div className="chat-main-body">
            {selectedContact ? (
              (messages[selectedContact.username] || []).map(m => (
                <div key={m.id} className={`chat-bubble-row ${m.sender}`}>
                  <div className="chat-bubble">
                    {m.text}
                    <span className="chat-bubble-time">{m.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="chat-empty-state">
                <MessageSquare size={40} />
                <p>Mesajlaşmaq üçün istifadəçi seçin</p>
              </div>
            )}
          </div>

          {selectedContact && (
            <form className="chat-main-footer" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Mesaj yaz..." 
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
              />
              <button type="submit"><Send size={18}/></button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatModal;