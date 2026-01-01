import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, MessageCircle, Send, X, LogOut, Bell, Loader } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';
import { useChat } from '../Context/ChatContext';
import { useData } from '../Context/DataContext'; 
import api from '../api';

import mainLogo from '../Assets/mainLogo.svg';
import changeLang from '../Assets/changeLang.svg';
import changeCurr from '../Assets/changeCurr.svg';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  // Context-lər
  const { language, setLanguage, currency, setCurrency, currencyOptions } = useSettings();
  const { startChat } = useChat();
  const { refreshData } = useData();

  // --- STATE-LƏR ---
  const [user, setUser] = useState(null);
  
  // Axtarış
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Seçilən İstifadəçi və Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionView, setActionView] = useState('main'); // 'main' | 'transfer'
  
  // Bildirişlər
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Transfer Formu
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  // Kənara klikləməyi izləmək üçün
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // 1. BAŞLANĞIC: Useri və Bildirişləri Yüklə
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchNotifications();
      // Real-time üçün hər 5 saniyədən bir yoxla
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (e) { 
      // Səssiz xəta (console.log etmirik ki, ekran dolmasın)
    }
  };

  const markAsRead = async (id) => {
    try {
       await api.put(`/notifications/${id}/read`);
       setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
       setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) { console.error(e); }
  };

  // 2. AXTARIŞ MƏNTİQİ (Debounce ilə)
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
           const { data } = await api.get(`/users/search?query=${searchQuery}`);
           setSearchResults(data);
        } catch (e) { console.error("Axtarış xətası:", e); }
      } else { 
        setSearchResults([]); 
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // --- VACİB: FUNKSİYALAR ---

  // İstifadəçini seçəndə işləyən funksiya
const handleSelectUser = (u) => {
      console.log("Seçilən User obyekti:", u); // Debug üçün konsola baxın
      
      // Həm _id, həm də id yoxlayırıq
      const targetId = u._id || u.id;

      if (!targetId) {
          alert("Xəta: Serverdən istifadəçi ID-si gəlmədi!");
          return;
      }

      // Seçilən obyektə ID-ni dəqiqləşdirib qoyuruq
      setSelectedUser({ ...u, _id: targetId });
      
      setActionView('main');
      setSearchResults([]); 
      setSearchQuery('');
  };
  // DOSTLUQ SORĞUSU
  const handleFriendRequest = async () => {
    if (!selectedUser || !selectedUser._id) {
        return alert("Xəta: İstifadəçi seçilməyib (ID yoxdur)");
    }

    try {
      // Server 'recipientId' gözləyir
      const payload = { recipientId: selectedUser._id };
      console.log("Göndərilən Dostluq Payload:", payload);

      await api.post('/friends/request', payload);
      
      alert("Dostluq sorğusu uğurla göndərildi!");
      setSelectedUser(null);
      setSearchQuery('');
    } catch (error) {
      console.error("Dostluq Xətası:", error.response?.data);
      alert(error.response?.data?.message || "Dostluq göndərilə bilmədi");
    }
  };

  // PUL KÖÇÜRMƏ
  const handleTransfer = async () => {
    if (!selectedUser || !selectedUser.username) {
        return alert("Xəta: İstifadəçi adı tapılmadı");
    }
    if (!transferAmount || Number(transferAmount) <= 0) {
        return alert("Zəhmət olmasa düzgün məbləğ daxil edin");
    }

    setTransferLoading(true);
    try {
       // Server 'recipientUsername' və 'amount' gözləyir
       const payload = { 
           recipientUsername: selectedUser.username, 
           amount: Number(transferAmount) 
       };
       console.log("Göndərilən Transfer Payload:", payload);

       await api.post('/transactions/transfer', payload);
       
       alert("Pul uğurla köçürüldü!");
       refreshData(); // Balansı yenilə
       
       setSelectedUser(null);
       setTransferAmount('');
       setActionView('main');
       setSearchQuery('');
    } catch (error) {
       console.error("Transfer Xətası:", error.response?.data);
       alert(error.response?.data?.message || "Transfer zamanı xəta oldu");
    } finally {
       setTransferLoading(false);
    }
  };

  

  const handleStartChat = () => {
    startChat(selectedUser);
    setSelectedUser(null);
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Menyudan kənar klikləyəndə bağla
  useEffect(() => {
    const handleClickOutside = (e) => {
       if (menuRef.current && !menuRef.current.contains(e.target)) setSearchResults([]);
       if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatUsername = (u) => u && u.startsWith('@') ? u : `@${u || 'user'}`;

  return (
    <>
      <header className="header">
        <div className="header-wrapper">
          {/* LOGO */}
          <div className="header-logo" onClick={() => navigate('/')}>
            <img src={mainLogo} alt="Volpe" width="40" height="40" />
            <span style={{fontSize: '24px', fontWeight: 'bold'}}>Volpe</span>
          </div>

          {/* AXTARIŞ */}
          <div className="header-search-container" ref={menuRef}>
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="İstifadəçi axtar..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            
            {/* AXTARIŞ NƏTİCƏLƏRİ */}
            {searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((u, index) => (
                  <div 
                    key={u._id || index} 
                    className="search-result-item" 
                    onClick={() => handleSelectUser(u)} // <-- Düzəliş Buradadır
                  >
                    <div className="result-avatar">
                        {u.avatar ? <img src={u.avatar} alt=""/> : u.name?.charAt(0)}
                    </div>
                    <div className="result-info">
                       <div className="result-name">{u.name}</div>
                       <div className="result-username">{formatUsername(u.username)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SAĞ TƏRƏF */}
          <div className="header-actions">
            {user ? (
              <>
                {/* Bildirişlər */}
                <div className="notification-wrapper" ref={notifRef}>
                   <button onClick={() => setShowNotifs(!showNotifs)} className="icon-btn">
                       <Bell size={24} color="#94a3b8"/>
                       {unreadCount > 0 && <span className="red-dot"></span>}
                   </button>
                   {showNotifs && (
                       <div className="notif-dropdown">
                           <div className="notif-header">Bildirişlər</div>
                           <div className="notif-list">
                               {notifications.length === 0 ? <p className="no-notif">Bildiriş yoxdur</p> :
                                  notifications.map((n, i) => (
                                      <div key={n._id || i} className={`notif-item ${!n.read?'unread':''}`} 
                                           onClick={() => markAsRead(n._id)}>
                                          <p className="notif-msg">{n.message}</p>
                                          <span className="notif-time">{new Date(n.createdAt).toLocaleTimeString()}</span>
                                      </div>
                                  ))
                               }
                           </div>
                       </div>
                   )}
                </div>

                {/* Dil & Valyuta */}
                <div className="lang-curr-group">
                    <img src={changeLang} alt="Lang" className="action-icon" onClick={() => setLanguage(language === 'AZ' ? 'EN' : 'AZ')} />
                    <span className="lang-text">{language}</span>
                    <div className="divider"></div>
                    <img src={changeCurr} alt="Curr" className="action-icon" onClick={() => {
                        const nextIdx = (currencyOptions.findIndex(c => c.code === currency) + 1) % currencyOptions.length;
                        setCurrency(currencyOptions[nextIdx].code);
                    }} />
                    <span className="curr-text">{currency}</span>
                </div>

                {/* Profil */}
                <div className="user-profile" onClick={() => navigate('/profile')}>
                    <div className="user-avatar-small">{user.avatar ? <img src={user.avatar} alt=""/> : user.name?.charAt(0)}</div>
                    <div className="user-info-text">
                        <span className="user-name">{user.name}</span>
                        <span className="user-tag">{formatUsername(user.username)}</span>
                    </div>
                </div>
                
                {/* Çıxış */}
                <button onClick={handleLogout} className="logout-btn"><LogOut size={20}/></button>
              </>
            ) : (
               <div className="auth-buttons">
                  <button className="login-btn" onClick={() => navigate('/login')}>Giriş</button>
                  <button className="signup-btn" onClick={() => navigate('/signup')}>Qeydiyyat</button>
               </div>
            )}
          </div>
        </div>
      </header>

      {/* --- MODAL (ƏMƏLİYYATLAR) --- */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
             <button className="close-modal" onClick={() => setSelectedUser(null)}><X size={20}/></button>
             
             {/* 1. ƏSAS GÖRÜNÜŞ (Buttons) */}
             {actionView === 'main' && (
                 <div className="modal-content animate-fade">
                    <div className="modal-avatar-large">
                        {selectedUser.avatar ? <img src={selectedUser.avatar} alt=""/> : selectedUser.name?.charAt(0)}
                    </div>
                    <h2 style={{color:'white'}}>{selectedUser.name}</h2>
                    <p className="modal-username">{formatUsername(selectedUser.username)}</p>
                    
                    <div className="modal-actions-grid">
                        <button className="modal-action-btn primary" onClick={handleFriendRequest}>
                            <UserPlus size={20}/> <span>Dostluq at</span>
                        </button>
                        <button className="modal-action-btn secondary" onClick={handleStartChat}>
                            <MessageCircle size={20}/> <span>Mesaj yaz</span>
                        </button>
                        <button className="modal-action-btn success" onClick={() => setActionView('transfer')}>
                            <Send size={20}/> <span>Pul köçür</span>
                        </button>
                    </div>
                 </div>
             )}

             {/* 2. TRANSFER GÖRÜNÜŞÜ (Form) */}
             {actionView === 'transfer' && (
                 <div className="modal-content transfer-view animate-fade">
                    <div className="view-header" style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px'}}>
                       <button onClick={() => setActionView('main')} style={{background:'none', border:'none', color:'#8b949e', cursor:'pointer'}}>← Geri</button>
                       <span style={{color:'white', fontWeight:'bold'}}>Pul Köçürmə</span>
                    </div>
                    
                    <div className="transfer-details" style={{background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'12px', textAlign:'left', marginBottom:'20px'}}>
                       <p style={{color:'#8b949e', fontSize:'12px', margin:0}}>Qəbul edən:</p>
                       <h3 style={{color:'white', margin:'5px 0'}}>{selectedUser.name}</h3>
                       <span style={{color:'#2dd4bf', fontSize:'12px'}}>{formatUsername(selectedUser.username)}</span>
                    </div>

                    <div className="transfer-input-group">
                       <label style={{display:'block', textAlign:'left', color:'#8b949e', marginBottom:'5px'}}>Məbləğ (AZN)</label>
                       <input 
                           type="number" 
                           placeholder="0.00" 
                           autoFocus 
                           value={transferAmount} 
                           onChange={(e) => setTransferAmount(e.target.value)} 
                           style={{width:'100%', padding:'12px', background:'#0d1117', border:'1px solid #30363d', color:'white', borderRadius:'8px', fontSize:'18px'}}
                       />
                    </div>
                    
                    <button 
                        className="confirm-transfer-btn" 
                        onClick={handleTransfer} 
                        disabled={transferLoading}
                        style={{marginTop:'20px', width:'100%', padding:'12px', background:'#2dd4bf', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}
                    >
                        {transferLoading ? <Loader className="animate-spin" size={20}/> : "Təsdiqlə və Göndər"}
                    </button>
                 </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;