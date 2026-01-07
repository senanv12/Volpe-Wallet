import React, { useState } from 'react';
import { Search, Send, UserPlus, User, MoreVertical } from 'lucide-react';
import './css/Chat.css';

function Chat() {
  const [contacts, setContacts] = useState([
    { id: 1, username: 'admin', name: 'Sistem Admin', lastMsg: 'Xoş gəldiniz!' }
  ]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newUserQuery, setNewUserQuery] = useState('');
  const [messages, setMessages] = useState({}); // { username: [msg1, msg2] }
  const [inputMsg, setInputMsg] = useState('');

  // Yeni user əlavə etmə və ya seçmə
  const handleAddContact = () => {
    if (!newUserQuery.trim()) return;
    
    const username = newUserQuery.replace('@', '').toLowerCase();
    const exists = contacts.find(c => c.username === username);

    if (!exists) {
      const newContact = {
        id: Date.now(),
        username: username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        lastMsg: 'Söhbətə başlayın...'
      };
      setContacts([newContact, ...contacts]);
      setSelectedContact(newContact);
    } else {
      setSelectedContact(exists);
    }
    setNewUserQuery('');
  };

  // Mesaj göndərmə (Yalnız vizual)
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

    setMessages({
      ...messages,
      [selectedContact.username]: [...currentChat, newMsg]
    });

    setInputMsg('');
  };

  return (
    <div className="chat-container">
      {/* SOL TƏRƏF: İstifadəçi Siyahısı */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Mesajlar</h3>
          <div className="add-user-box">
            <input 
              type="text" 
              placeholder="@username yaz..." 
              value={newUserQuery}
              onChange={(e) => setNewUserQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddContact()}
            />
            <button onClick={handleAddContact}><UserPlus size={18} /></button>
          </div>
        </div>

        <div className="contacts-list">
          {contacts.map(c => (
            <div 
              key={c.id} 
              className={`contact-item ${selectedContact?.username === c.username ? 'active' : ''}`}
              onClick={() => setSelectedContact(c)}
            >
              <div className="contact-avatar">{c.name[0]}</div>
              <div className="contact-info">
                <span className="contact-name">{c.name}</span>
                <span className="contact-last-msg">{c.lastMsg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ TƏRƏF: Mesajlaşma Ekranı */}
      <div className="chat-main">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div className="header-info">
                <div className="contact-avatar-small">{selectedContact.name[0]}</div>
                <div>
                  <h4>{selectedContact.name}</h4>
                  <span>online</span>
                </div>
              </div>
              <MoreVertical size={20} className="header-icon" />
            </div>

            <div className="chat-messages">
              {(messages[selectedContact.username] || []).map(m => (
                <div key={m.id} className={`message-wrapper ${m.sender}`}>
                  <div className="message-bubble">
                    {m.text}
                    <span className="message-time">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Mesaj yazın..." 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <Search size={48} />
            <p>Söhbətə başlamaq üçün istifadəçi seçin və ya yeni @username daxil edin</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;